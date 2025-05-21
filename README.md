# 📝 Remove Background

## Demo

Puedes ver una demostración del proyecto en funcionamiento en las siguientes URLs:

- **Demo en vivo:** [ec2-3-254-74-19.eu-west-1.compute.amazonaws.com:3000/](http://ec2-3-254-74-19.eu-west-1.compute.amazonaws.com:3000/)
- **Video tutorial:** [https://www.youtube.com/watch?v=t9OjTltR6FY](https://www.youtube.com/watch?v=t9OjTltR6FY)
- **Repositorio en GitHub:** [https://github.com/JordiNodeJS/remove-background](https://github.com/JordiNodeJS/remove-background)

**Remove Background** es una aplicación web que permite eliminar automáticamente el fondo de imágenes utilizando inteligencia artificial. El usuario puede subir una imagen, el sistema procesa la imagen en el backend y devuelve una versión sin fondo lista para descargar o comparar. El objetivo principal de este proyecto es servir como ejemplo educativo para aprender a estructurar y desplegar un monorepo moderno con Next.js y Express usando Bun como gestor de paquetes.

## 🚀 Tecnologías Utilizadas

- **Next.js 15** (Frontend, React, SSR)
- **Express** (Backend, API REST)
- **Bun** (Gestor de paquetes y scripts, workspaces)
- **TypeScript** (Tipado estático en todo el monorepo)
- **@imgly/background-removal-node** (Procesamiento de imágenes en backend)
- **Tailwind CSS** (Estilos en el frontend)
- **React Hot Toast** (Notificaciones)
- **Clerk** (Autenticación: login, registro, recuperación de contraseña)

## 📋 Estructura del Proyecto

Este es un proyecto monorepo que integra Next.js 15 para el frontend y Express con Bun para el backend:

```
remove-background/
├── apps/
│   ├── frontend/     # Aplicación Next.js 15 (interfaz de usuario)
│   └── api/          # Servidor Express (servicios REST)
├── docs/             # Documentación adicional del proyecto
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

## 📚 Puntos Importantes Aprendidos

- **Estructura de monorepo**: Separación de apps (frontend y backend) y paquetes compartidos.
- **Workspaces con Bun**: Configuración de workspaces para gestionar dependencias y scripts de manera eficiente.
- **Integración Next.js + Express**: Comunicación entre frontend y backend usando rutas API y fetch server-to-server.
- **Gestión de archivos y rutas dinámicas**: Cómo manejar uploads, almacenamiento y servir archivos generados dinámicamente en producción.
- **Variables de entorno y configuración multiplataforma**: Uso de variables para distinguir entornos y evitar problemas de rutas absolutas/relativas.
- **Despliegue y build en producción**: Scripts para build y arranque concurrente, y consideraciones para servir imágenes procesadas.
- **Buenas prácticas de tipado y modularidad**: Uso de TypeScript y separación de lógica en controladores, servicios y utilidades.

## 💡 Mejoras Futuras

- Historial de imágenes procesadas por usuario
- Soporte para más formatos de imagen y mayor tamaño
- Procesamiento en background y notificaciones por email
- Interfaz de administración para moderar imágenes
- Integración con almacenamiento en la nube (S3, Azure Blob)
- Pruebas automatizadas E2E y cobertura de tests
- Despliegue automatizado (CI/CD) y monitorización avanzada

## Características Principales

- **Eliminación de fondos**: Procesamiento automático de imágenes para eliminar fondos
- **Personalización**: Opciones para ajustar la precisión y calidad del resultado
- **Previsualización en tiempo real**: Visualización instantánea del resultado
- **Exportación flexible**: Descarga en diferentes formatos (PNG, JPG) y resoluciones
- **API REST**: Endpoints para integración con otros servicios
- **Autenticación**: Login, registro y recuperación de contraseña con Clerk

## 🚀 Instalación y Desarrollo

### Requisitos previos

- Bun 1.0.0 o superior
- Node.js 18.0.0 o superior

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/remove-background.git
cd remove-background

# Instalar dependencias con Bun
bun install
```

### Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
bun dev

# O iniciar servicios individualmente
bun --filter frontend dev  # Iniciar solo el frontend
bun --filter api start     # Iniciar solo el backend
```

## 🌐 Flujo de autenticación y rutas

- **Landing page:** `/` (catch-all, implementada en `app/[[...rest]]/page.tsx`)
- **Registro:** `/sign-up`
- **Recuperación:** `/forgot-password`
- **Dashboard protegido:** `/dashboard` (requiere login, muestra el componente de procesamiento de imágenes)

### Clerk y Middleware

- Clerk maneja login, registro y recuperación.
- El middleware de Clerk solo protege rutas privadas (dashboard, procesamiento, etc). Las rutas públicas (`/`, `/sign-up`, `/forgot-password`) quedan abiertas.
- El archivo `middleware.ts` contiene el matcher actualizado para excluir rutas públicas.

## ⚙️ Despliegue en producción con PM2

Este monorepo utiliza [PM2](https://pm2.keymetrics.io/) para gestionar los servicios en producción:

```bash
# Construir todos los paquetes
bun run build

# Instalar PM2 globalmente
bun add -g pm2

# Levantar los servicios
pm2 start ecosystem.config.js
```

### Monitoreo y gestión

```bash
pm2 logs             # Ver logs
pm2 status           # Estado de los servicios
pm2 restart monorepo-bun-start  # Reiniciar servicios
```

PM2 se ejecuta utilizando el archivo `ecosystem.config.js` que define la configuración de los servicios, entornos, variables y comportamiento de logs. Este archivo se encuentra en la raíz del proyecto y contiene toda la configuración necesaria para gestionar los procesos del monorepo en producción.

```javascript
// Ejemplo simplificado del archivo ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "monorepo-bun-start",
      script: "bun",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

## Variables de entorno

- `NEXT_PUBLIC_API_URL` — URL del backend para el frontend
- `PORT` — Puerto del backend

## 🔍 Troubleshooting

- Si ves errores de health check, asegúrate de que el backend Express esté corriendo y accesible.
- Elimina cualquier archivo `app/page.tsx` para evitar conflictos con la ruta catch-all.
- Si Clerk muestra error de configuración, revisa que la ruta de login sea catch-all y el middleware permita acceso público a rutas de autenticación.

## Notas sobre el despliegue

- El proyecto está desplegado en un VPS de AWS EC2.
- El procesamiento de imágenes (eliminación de fondo) se realiza en una máquina de pocos recursos, demostrando que la solución es eficiente y puede funcionar en entornos con hardware limitado.

## Contribución

Si deseas contribuir a este proyecto, por favor:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
