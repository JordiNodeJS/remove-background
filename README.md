# 📝 Resumen del Proyecto

## Demo

Puedes ver una demostración del proyecto en funcionamiento en las siguientes URLs:

- **Demo en vivo:** [http://ec2-63-35-184-124.eu-west-1.compute.amazonaws.com:3000/](http://ec2-63-35-184-124.eu-west-1.compute.amazonaws.com:3000/)
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
  - Migración a ruta catch-all para login Clerk.
  - Middleware ajustado para rutas públicas.
  - Dashboard protegido y funcional tras login.
  - Animaciones y estilos modernos en la landing.

## 📚 Puntos Importantes Aprendidos

Este proyecto se diseñó para aprender y practicar la creación de un monorepo profesional con separación clara entre frontend y backend. Los aprendizajes clave incluyen:

- **Estructura de monorepo**: Separación de apps (frontend y backend) y paquetes compartidos.
- **Workspaces con Bun**: Configuración de workspaces para gestionar dependencias y scripts de manera eficiente.
- **Integración Next.js + Express**: Comunicación entre frontend y backend usando rutas API y fetch server-to-server.
- **Gestión de archivos y rutas dinámicas**: Cómo manejar uploads, almacenamiento y servir archivos generados dinámicamente en producción.
- **Variables de entorno y configuración multiplataforma**: Uso de variables para distinguir entornos y evitar problemas de rutas absolutas/relativas.
- **Despliegue y build en producción**: Scripts para build y arranque concurrente, y consideraciones para servir imágenes procesadas.
- **Buenas prácticas de tipado y modularidad**: Uso de TypeScript y separación de lógica en controladores, servicios y utilidades.

### Desglose de puntos importantes

- Monorepo con apps y packages compartidos
- Configuración de scripts y workspaces en Bun
- Comunicación robusta entre Next.js y Express
- Manejo seguro de archivos y rutas en producción
- Uso de rutas API dinámicas en Next.js para servir recursos
- Diagnóstico y solución de errores comunes en despliegue
- Automatización de build y arranque para producción

## 💡 Mejoras Futuras

- Historial de imágenes procesadas por usuario
- Soporte para más formatos de imagen y mayor tamaño
- Procesamiento en background y notificaciones por email
- Interfaz de administración para moderar imágenes
- Integración con almacenamiento en la nube (S3, Azure Blob)
- Pruebas automatizadas E2E y cobertura de tests
- Despliegue automatizado (CI/CD) y monitorización avanzada

### Mejoras completadas

- Autenticación de usuarios y gestión de cuentas

---

# Remove Background

## Descripción

Este proyecto es una aplicación web para eliminar fondos de imágenes de manera automática utilizando técnicas avanzadas de procesamiento de imágenes e inteligencia artificial. Permite a los usuarios subir imágenes, eliminar sus fondos y descargar el resultado con fondo transparente o personalizado.

## Estructura del Proyecto

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

Para más detalles sobre la comunicación entre el frontend y el backend, consulta el documento [Comunicación con la API del Backend](./docs/api_communication.md).

**Note:** The frontend currently uses `curl` via `child_process.execSync` to communicate with the backend. It is highly recommended to replace this with a Node.js HTTP client like `axios` or `node-fetch` for better error handling, performance, and security.

## Características Principales

- **Eliminación de fondos**: Procesamiento automático de imágenes para eliminar fondos
- **Personalización**: Opciones para ajustar la precisión y calidad del resultado
- **Previsualización en tiempo real**: Visualización instantánea del resultado
- **Exportación flexible**: Descarga en diferentes formatos (PNG, JPG) y resoluciones
- **API REST**: Endpoints para integración con otros servicios

## Requisitos Técnicos

- [Bun](https://bun.sh/) 1.0.0 o superior
- Node.js 18.0.0 o superior

## Instalación

### Requisitos previos

- Bun 1.0.0 o superior
- Node.js 18.0.0 o superior

### Creación del proyecto desde cero

```bash
# Crear la estructura de carpetas del monorepo
mkdir -p remove-background/apps remove-background/packages
cd remove-background

# Inicializar el proyecto raíz
bun init -y
```

#### Configurar package.json raíz para workspaces

Edita el archivo `package.json` en la raíz para incluir la configuración de workspaces:

```json
{
  "name": "remove-background",
  "version": "1.0.0",
  "description": "Aplicación web para eliminar fondos de imágenes automáticamente",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:all": "bun run --parallel --filter=@remove-background/frontend dev --filter=@remove-background/api dev",
    "dev": "bun run --parallel --filter=* dev",
    "build": "bun run --parallel --filter=* build",
    "start": "bun run --parallel --filter=* start"
  },
  "engines": {
    "node": ">=18.0.0",
    "bun": ">=1.0.0"
  }
}
```

#### Crear Frontend con Next.js 15 usando bunx

```bash
# Crear la aplicación Next.js 15 usando bunx (sin instalación global)
cd apps
bunx --yes create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ..
```

#### Crear Backend con Express usando bunx

```bash
# Crear la aplicación Express usando bunx
cd apps
mkdir api && cd api
bun init -y

# Instalar dependencias de Express
bun add express cors helmet
bun add -d @types/express @types/cors typescript ts-node

# Inicializar configuración de TypeScript
bunx --yes tsc --init
cd ../..
```

#### Crear paquete compartido

```bash
cd packages
mkdir shared && cd shared
bun init -y

# Configurar TypeScript para el paquete compartido
bun add -d typescript
bunx --yes tsc --init
cd ../..
```

### Instalación desde repositorio existente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/remove-background.git
cd remove-background

# Instalar dependencias con Bun
bun install
```

### Instalación en desarrollo

Para instalar todas las dependencias y ejecutar ambos servicios:

```bash
bun install
bun dev
```

## Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
bun dev

# O iniciar servicios individualmente
bun --filter frontend dev  # Iniciar solo el frontend
bun --filter api start     # Iniciar solo el backend
```

### Uso de bunx durante el desarrollo

Puedes utilizar `bunx` para ejecutar paquetes sin necesidad de instalarlos globalmente:

```bash
# Ejecutar herramientas de desarrollo con bunx
bunx --yes prettier --write "apps/**/*.{ts,tsx}"  # Formatear código
bunx --yes eslint apps/frontend                   # Ejecutar linter
bunx --yes tsc --noEmit                           # Verificar tipos

# Generar componentes o archivos con herramientas externas
bunx --yes plop component MyNewComponent          # Si tienes plop configurado

# Ejecutar scripts de migración o semillas para la base de datos
bunx --yes prisma migrate dev                     # Si usas Prisma
```

## Despliegue

```bash
# Construir todos los paquetes
bun run build

# Iniciar en modo producción
bun start
```

### Despliegue con bunx

Puedes utilizar `bunx` para herramientas de despliegue sin instalarlas globalmente:

```bash
# Verificar tipos antes del despliegue
bunx --yes tsc --noEmit

# Ejecutar pruebas antes del despliegue
bunx --yes jest

# Desplegar en plataformas específicas
bunx --yes vercel deploy --prod                  # Desplegar en Vercel
bunx --yes netlify deploy --prod                 # Desplegar en Netlify

# Optimizar imágenes antes del despliegue
bunx --yes sharp-cli --input ./public/images --output ./public/optimized
```

## Contribución

Si deseas contribuir a este proyecto, por favor:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Despliegue y gestión en producción con PM2

Este monorepo utiliza [PM2](https://pm2.keymetrics.io/) para gestionar los servicios de frontend (Next.js) y backend (Express) en producción, aprovechando la integración con Bun.

### Pasos para producción

1. **Instalar PM2 globalmente:**

   ```bash
   bun add -g pm2
   ```

2. **Configurar el archivo `ecosystem.config.js`:**
   El archivo ya está preparado para lanzar ambos servicios con un solo comando. La configuración principal es:

   ```js
   module.exports = {
     apps: [
       {
         name: "monorepo-bun-start",
         script: "bun",
         args: "start",
         cwd: __dirname, // raíz del monorepo
         interpreter: "none",
         env: {
           NODE_ENV: "production",
         },
         watch: false,
         autorestart: true,
         max_restarts: 5,
         error_file: "./logs/pm2-error.log",
         out_file: "./logs/pm2-out.log",
         merge_logs: true,
       },
     ],
   };
   ```

3. **Levantar los servicios:**

   ```bash
   pm2 start ecosystem.config.js
   ```

4. **Ver logs y estado:**

   ```bash
   pm2 logs
   pm2 status
   ```

5. **Reiniciar o detener:**
   ```bash
   pm2 restart monorepo-bun-start
   pm2 stop monorepo-bun-start
   ```

### Notas

- PM2 se encargará de reiniciar los servicios en caso de fallo y de gestionar los logs.
- Puedes personalizar variables de entorno y rutas de logs en el archivo `ecosystem.config.js`.
- Para más detalles, revisa la sección "Guía de Despliegue en Producción" en `docs/08_guia-produccion.md`.

---

# Remove Background Monorepo

## Arquitectura

- **Frontend:** Next.js 15 (apps/frontend)
- **Backend:** Express (apps/api)
- **Gestor:** Bun
- **Autenticación:** Clerk (login, registro, recuperación de contraseña)

## Estructura de carpetas

```
mi-proyecto/
├── apps/
│   ├── frontend/     # Next.js 15 (interfaz de usuario)
│   └── api/          # Express (servicios REST/GraphQL)
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

## Flujo de autenticación y rutas

- **Landing page:** `/` (catch-all, implementada en `app/[[...rest]]/page.tsx`)
- **Registro:** `/sign-up`
- **Recuperación:** `/forgot-password`
- **Dashboard protegido:** `/dashboard` (requiere login, muestra el componente de procesamiento de imágenes)

### Clerk y Middleware

- Clerk maneja login, registro y recuperación.
- El middleware de Clerk solo protege rutas privadas (dashboard, procesamiento, etc). Las rutas públicas (`/`, `/sign-up`, `/forgot-password`) quedan abiertas.
- El archivo `middleware.ts` contiene el matcher actualizado para excluir rutas públicas.

## Troubleshooting

- Si ves errores de health check, asegúrate de que el backend Express esté corriendo y accesible.
- Elimina cualquier archivo `app/page.tsx` para evitar conflictos con la ruta catch-all.
- Si Clerk muestra error de configuración, revisa que la ruta de login sea catch-all y el middleware permita acceso público a rutas de autenticación.

## Scripts útiles

- `bun run --filter=@remove-background/frontend dev` — Arranca el frontend
- `bun run --filter=@remove-background/api dev` — Arranca el backend

## Variables de entorno

- `NEXT_PUBLIC_API_URL` — URL del backend para el frontend
- `PORT` — Puerto del backend

---

## Cambios recientes

- Migración a ruta catch-all para login Clerk.
- Middleware ajustado para rutas públicas.
- Dashboard protegido y funcional tras login.
- Animaciones y estilos modernos en la landing.
- Troubleshooting ampliado para health check y rutas protegidas.

## Notas sobre el despliegue y rendimiento

- El proyecto está desplegado en un VPS de AWS EC2.
- El procesamiento de imágenes (eliminación de fondo) se realiza en una máquina de pocos recursos, demostrando que la solución es eficiente y puede funcionar en entornos con hardware limitado.
