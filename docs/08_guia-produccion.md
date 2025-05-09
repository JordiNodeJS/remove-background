# 8. Guía de Despliegue en Producción

Esta guía describe los pasos y configuraciones recomendadas para desplegar el monorepo Remove Background en producción, incluyendo build optimizado, variables de entorno, configuración de servidores y pruebas de endpoints clave.

## 1. Compilación y Arranque de Proyectos

La forma más sencilla de compilar y arrancar ambos proyectos (frontend y API) en modo producción es utilizando el script `start:prod:full` desde la raíz del monorepo. Este comando se encarga de compilar ambos proyectos y luego iniciarlos.

```bash
# Compilar y arrancar ambos proyectos desde la raíz
bun run start:prod:full
```

Este comando ejecuta internamente `bun run build:all` seguido de los comandos de inicio para cada aplicación.

### Build Individual (Alternativo)

Si necesitas compilar los proyectos de forma individual, puedes usar los siguientes comandos:

```bash
# Build Frontend (Next.js 15)
bun run --filter=@remove-background/frontend build

# Build API (Express)
bun run --filter=@remove-background/api build
```

Después de la compilación individual, necesitarás iniciar los servicios por separado (ver sección de Arranque Automatizado).

### Verificación Post-Compilación

```bash
# Verificar estructura de carpetas generadas
ls -l apps/frontend/.next/static && ls -l apps/api/dist

# Prueba rápida del backend
curl http://localhost:3001/health
```

### Configuración Requerida

Asegurar que ambos proyectos tienen en su tsconfig.json:

```json
{
  "compilerOptions": {
    "outDir": "./dist", // Directorio de salida para los archivos compilados
    "moduleResolution": "bundler" // Estrategia de resolución de módulos para Bun
  }
}
```

**Explicación técnica:**

- `outDir`: Especifica el directorio donde TypeScript colocará los archivos JavaScript compilados. Esto debe coincidir con la configuración de build de cada proyecto.
- `moduleResolution`: La opción "bundler" es necesaria para la compatibilidad con Bun, permitiendo la resolución de módulos similar a los empaquetadores modernos.

Esta configuración en tsconfig.json es crucial porque:

1. `outDir: "./dist"`

- Define dónde se generarán los archivos compilados (JS)
- Mantiene estructura limpia separando código fuente (TS) de compilados
- Esencial para despliegues ya que Node.js ejecuta JS, no TS directamente

2. `moduleResolution: "bundler"`

- Optimiza resolución de módulos para Bun/Webpack/Vite
- Permite imports sin extensiones y alias de rutas
- Mejora compatibilidad con ES Modules y CommonJS
  Juntos garantizan:

- Builds consistentes entre entornos
- Resolución correcta de dependencias
- Compatibilidad con herramientas modernas como Bun
- Configuración unificada para todo el monorepo

## 2. Arranque Automatizado en Producción

Como se mencionó en la sección anterior, la forma recomendada para compilar e iniciar ambos servicios en producción es con el comando:

```bash
# Compilar y arrancar ambos proyectos desde la raíz
bun run start:prod:full
```

Este comando simplifica el proceso, ya que maneja tanto la compilación como el inicio de los servicios.

Si has compilado los proyectos individualmente (ver "Build Individual (Alternativo)"), puedes iniciar los servicios manualmente o utilizando un script. Para un inicio concurrente después de un build individual, puedes seguir usando un script similar al `start-prod.sh` si lo prefieres, o iniciar cada servicio en terminales separadas:

En una terminal (desde la raíz del proyecto):

```bash
cd apps/frontend
bun run start
```

En otra terminal (desde la raíz del proyecto):

```bash
cd apps/api
bun run start
```

Sin embargo, el uso de `bun run start:prod:full` es preferible para la mayoría de los casos de despliegue en producción.

## 3. Variables de Entorno

Crear archivo `.env.production` en raíz:

```env
NODE_ENV=production
API_PORT=3001
FRONTEND_URL=https://tudominio.com
API_URL=https://api.tudominio.com
```

## 4. Configuración Web Server (Caddy)

```caddy
# Configuración básica con HTTPS automático (Windows/Git Bash)
http://, https:// {
    # Frontend Next.js
    handle / {
        root * /var/www/frontend/out
        try_files {path} /_next/static/index.html
        file_server
    }

    # API Express
    handle /api/* {
        reverse_proxy localhost:3001 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
        }
    }

    # Configuración SSL automática
    tls internal {
        on_demand
    }
}
```

### Opción 1: Docker (Recomendado)

```dockerfile
# Dockerfile para Caddy
FROM caddy:2.8-alpine

COPY ./Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443 2019

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
```

**Comandos Docker para Windows:**

```powershell
#!/bin/bash
# Verificar requisitos previos
if ! docker --version >/dev/null 2>&1; then
    echo "ERROR: Docker no está instalado o no está en el PATH"
    exit 1
fi

# Validar puertos
if netstat -ano | grep -E ":80\s|:443\s"; then
    echo "ERROR: Puertos 80 o 443 en uso. Libere los puertos antes de continuar"
    exit 1
fi

# Crear directorios con rutas compatibles con Windows/Git Bash
mkdir -p /c/caddy/{config,data}

# Construir imagen Docker
cd /g/DEV/remove-background
docker build -t caddy-prod . || exit 1

# Ejecutar contenedor con manejo de errores
docker run -d \
  -p 80:80 -p 443:443 \
  -v /c/caddy/config:/config \
  -v /c/caddy/data:/data \
  --name caddy-prod \
  caddy-prod || exit 1

echo "Contenedor desplegado exitosamente. Verifique con 'docker ps'"
```

### Opción 2: Instalación Manual

```powershell
# Instalar Caddy usando Chocolatey
choco install caddy -y

# Iniciar servicio (requiere permisos de administrador)
Start-Process caddy -ArgumentList "start --config C:\ruta\al\Caddyfile" -Verb RunAs

# Configurar auto-arranque
Register-ScheduledTask -TaskName "CaddyService"
  -Trigger (New-ScheduledTaskTrigger -AtStartup)
  -Action (New-ScheduledTaskAction -Execute "caddy" -Argument "run --config C:\ruta\al\Caddyfile")
```

**Optimizaciones específicas:**

- Timeouts ajustados para entornos Windows
- Buffer sizes optimizados para Git Bash
- Logging en formato JSON para integración con PowerShell

## 4. Implementación con PM2

```bash
# Instalar PM2 globalmente
bun add -g pm2

# Archivo ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: './apps/frontend',
      script: 'bun run start',
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'api',
      cwd: './apps/api',
      script: 'bun run start',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

## 5. Health Checks y Monitoreo

```bash
# Health Check Endpoint (API)
curl http://localhost:3001/health

# Monitoreo PM2
pm2 monit

# Logs en tiempo real
pm2 logs
```

## 6. Uso de la Ruta `/remove-background`

La API incluye una ruta POST en `/remove-background` que permite eliminar el fondo de una imagen. A continuación, se detalla cómo probar esta funcionalidad:

### Ejemplo de Solicitud con `curl`

```bash
curl -X POST http://localhost:3001/remove-background -H "Content-Type: multipart/form-data" -F "image=@input-01.png"

```

```bash
curl -X POST  http://ec2-34-254-248-103.eu-west-1.compute.amazonaws.com:3001/remove-background -H "Content-Type: multipart/form-data" -F "image=@input-01.png"
```

### Explicación:

1. **`-X POST`**: Indica que es una solicitud POST.
2. **`http://localhost:3001/remove-background`**: URL de la ruta (ajusta el puerto si es diferente).

### Respuesta Esperada

Si la solicitud es exitosa, recibirás un JSON con el resultado del procesamiento de la imagen. En caso de error, se devolverá un mensaje con el código de estado correspondiente.

## Referencias del Proyecto

- [Configuración Next.js](./05_comandos-frontend.md)
- [Instalación Inicial](./03_comandos-instalacion.md)
- [Gestión de Entornos](../.gitignore#L5-L8)

Aquí tienes una guía en formato **Markdown** para configurar la memoria **swap** en un sistema Linux:

---

# 🛠️ Configurar Memoria Swap en Linux

## 1. Verificar si ya existe swap activo

Ejecuta el siguiente comando para comprobar el estado actual:

```bash
free -m
```

Si no hay swap activo, procede a crearlo .

---

## 2. Crear un archivo de swap

Por ejemplo, para generar un archivo de **2 GB**:

```bash
sudo fallocate -l 2G /swapfile
```

Si `fallocate` no está disponible, usa `dd`:

```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
```

Esto asigna espacio en disco para swap .

---

## 3. Configurar permisos seguros

Evita accesos no autorizados:

```bash
sudo chmod 600 /swapfile
```

---

## 4. Formatear el archivo como swap

Ejecuta:

```bash
sudo mkswap /swapfile
```

Este paso prepara el archivo para su uso como espacio de intercambio .

---

## 5. Activar el swap

Habilita el archivo con:

```bash
sudo swapon /swapfile
```

Verifica que esté activo con `free -m` .

---

## 6. Hacerlo persistente tras reinicios

Edita el archivo `/etc/fstab` y agrega esta línea:

```
/swapfile none swap sw 0 0
```

Esto asegura que el swap se active automáticamente al reiniciar .

---

## 7. Ajustar el parámetro _swappiness_

El _swappiness_ controla cuánto prioriza el sistema el uso de swap. Para ajustarlo temporalmente:

```bash
sysctl vm.swappiness=10
```

Para hacerlo permanente, edita `/etc/sysctl.conf` y agrega:

```
vm.swappiness=10
```

Valores bajos (0-10) reducen el uso de swap, mientras que valores altos (100) lo incrementan .

---

## 8. Verificar el uso de swap

- **Uso general**:
  ```bash
  free -m
  ```
- **Detalles de swap activo**:
  ```bash
  swapon --show
  ```
- **Procesos que usan swap**:
  ```bash
  grep Swap /proc/<PID>/smaps
  ```
  Donde `<PID>` es el ID del proceso .

---

## Consideraciones importantes

- **Rendimiento**: Usar swap en discos HDD o EBS puede generar latencia. Es preferible optimizar aplicaciones o escalar recursos .
- **Monitoreo**: Usa herramientas como `htop`, `vmstat` o `swapon --show` para verificar el uso de swap en tiempo real .
- **Redimensionar**: Si necesitas cambiar el tamaño del swap, desactívalo primero con `swapoff`, ajusta el archivo y vuelve a activarlo .
- **Alternativas**: En algunos casos, se puede usar una partición dedicada para swap (recomendado para servidores críticos) .

---
