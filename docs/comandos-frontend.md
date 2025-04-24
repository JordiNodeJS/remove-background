# Comandos de Instalación del Frontend (Next.js 15)

Este documento detalla específicamente los comandos utilizados para la instalación y configuración del frontend con Next.js 15 en el proyecto Remove Background.

## Instalación con Bun

Bun es el gestor de paquetes y entorno de ejecución utilizado en este proyecto. A continuación se muestran los comandos específicos para la instalación del frontend.

### Bash

```bash
# Crear la aplicación Next.js 15 usando bunx
cd apps
bunx --yes create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navegar al directorio del frontend
cd frontend

# Iniciar el servidor de desarrollo
bun dev
```

### PowerShell

```powershell
# Crear la aplicación Next.js 15 usando bunx
Set-Location -Path apps
bunx --yes create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navegar al directorio del frontend
Set-Location -Path frontend

# Iniciar el servidor de desarrollo
bun dev
```

## Opciones de Configuración Utilizadas

Al crear el proyecto Next.js 15 con `create-next-app`, se utilizaron las siguientes opciones:

- `--ts`: Habilita TypeScript
- `--tailwind`: Configura Tailwind CSS
- `--eslint`: Configura ESLint
- `--app`: Utiliza el nuevo App Router de Next.js 15
- `--src-dir`: Coloca los archivos de código fuente en un directorio `src`
- `--import-alias "@/*"`: Configura el alias de importación para facilitar las importaciones relativas

## Comandos de Desarrollo Comunes

Estos comandos funcionan igual en Bash y PowerShell:

```bash
# Iniciar el servidor de desarrollo
bun dev

# Construir para producción
bun run build

# Iniciar en modo producción (después de construir)
bun start

# Ejecutar linter
bunx --yes eslint .

# Verificar tipos de TypeScript
bunx --yes tsc --noEmit
```

## Comandos Específicos para el Frontend

Cuando se trabaja en el monorepo, se pueden ejecutar comandos específicamente para el frontend:

```bash
# Iniciar solo el frontend en modo desarrollo
bun --filter frontend dev

# Construir solo el frontend
bun --filter frontend build

# Iniciar solo el frontend en modo producción
bun --filter frontend start
```

Estos comandos funcionan de manera idéntica tanto en Bash como en PowerShell.