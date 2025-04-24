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
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

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
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
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
