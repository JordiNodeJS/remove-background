# Guía de Despliegue en Producción

## 1. Build Optimizado con Bun
```bash
# Build frontend (Next.js 15)
bun run --filter=@remove-background/frontend build

# Build API (Express)
bun run --filter=@remove-background/api build
```

## 2. Variables de Entorno
Crear archivo `.env.production` en raíz:
```env
NODE_ENV=production
API_PORT=3001
FRONTEND_URL=https://tudominio.com
API_URL=https://api.tudominio.com
```

## 3. Configuración Web Server (Caddy)
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


## Referencias del Proyecto
- [Configuración Next.js](./comandos-frontend.md)
- [Instalación Inicial](./comandos-instalacion.md)
- [Gestión de Entornos](../.gitignore#L5-L8)