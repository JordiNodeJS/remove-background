# 📝 Resumen del Proyecto

**Remove Background** es una aplicación web que permite eliminar automáticamente el fondo de imágenes utilizando inteligencia artificial. El usuario puede subir una imagen, el sistema procesa la imagen en el backend y devuelve una versión sin fondo lista para descargar o comparar. El objetivo principal de este proyecto es servir como ejemplo educativo para aprender a estructurar y desplegar un monorepo moderno con Next.js y Express usando Bun como gestor de paquetes.

## 🚀 Tecnologías Utilizadas

- **Next.js 15** (Frontend, React, SSR)
- **Express** (Backend, API REST)
- **Bun** (Gestor de paquetes y scripts, workspaces)
- **TypeScript** (Tipado estático en todo el monorepo)
- **@imgly/background-removal-node** (Procesamiento de imágenes en backend)
- **Tailwind CSS** (Estilos en el frontend)
- **React Hot Toast** (Notificaciones)

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

- Autenticación de usuarios y gestión de cuentas
- Historial de imágenes procesadas por usuario
- Soporte para más formatos de imagen y mayor tamaño
- Procesamiento en background y notificaciones por email
- Interfaz de administración para moderar imágenes
- Integración con almacenamiento en la nube (S3, Azure Blob)
- Pruebas automatizadas E2E y cobertura de tests
- Despliegue automatizado (CI/CD) y monitorización avanzada

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
