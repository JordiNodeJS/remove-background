# Comandos de Instalación para Remove Background

Este documento detalla los comandos utilizados para la instalación del proyecto Remove Background, tanto para bash como para PowerShell.

## Estructura del Proyecto

El proyecto es un monorepo que integra:
- Frontend con Next.js 15
- Backend con Express
- Bun como gestor de paquetes y entorno de ejecución

## Comandos para Bash

### Creación del Proyecto desde Cero

```bash
# Crear la estructura de carpetas del monorepo
mkdir -p remove-background/apps remove-background/packages
cd remove-background

# Inicializar el proyecto raíz
bun init -y
```

### Configuración del Frontend (Next.js 15)

```bash
# Navegar a la carpeta de aplicaciones
cd apps

# Crear la aplicación Next.js 15 usando bunx (sin instalación global)
bunx --yes create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ..
```

### Gestión de Dependencias con Bun
Bun utiliza una estructura de node_modules centralizada en workspaces:

```bash
# Estructura de directorios
tree -L 3 node_modules
# node_modules/
# ├── .bin
# ├── .cache
# └── (dependencias compartidas)

# Instalación local en workspace
bun add -D eslint @types/node --workspace=frontend
```

```powershell
# Ver dependencias instaladas
bun pm ls --all

# Actualizar dependencias específicas
bun update next typescript --workspace=frontend
```

Esta configuración optimiza:
- Espacio en disco mediante dependencias compartidas
- Velocidad de instalación con caché global
- Consistencia entre entornos con bun.lockb

### Configuración del Backend (Express)

🔗 Ver documentación completa: [Guía del Backend](../comandos-backend.md)

```bash
# Navegar a la carpeta de aplicaciones
cd apps

# Crear la carpeta para la API y navegar a ella
mkdir api && cd api

# Inicializar el proyecto
bun init -y

# Instalar dependencias de Express
bun add express cors helmet
bun add -d @types/express @types/cors typescript ts-node

# Inicializar configuración de TypeScript
bunx --yes tsc --init
cd ../..
```

### Creación de Paquete Compartido

```bash
# Navegar a la carpeta de paquetes
cd packages

# Crear la carpeta para el paquete compartido y navegar a ella
mkdir shared && cd shared

# Inicializar el proyecto
bun init -y

# Configurar TypeScript para el paquete compartido
bun add -d typescript
bunx --yes tsc --init
cd ../..
```

### Instalación desde Repositorio Existente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/remove-background.git
cd remove-background

# Instalar dependencias con Bun
bun install
```

### Comandos de Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
bun dev

# O iniciar servicios individualmente
bun --filter frontend dev  # Iniciar solo el frontend
bun --filter api start     # Iniciar solo el backend

# Ejecutar herramientas de desarrollo con bunx
bunx --yes prettier --write "apps/**/*.{ts,tsx}"  # Formatear código
bunx --yes eslint apps/frontend                   # Ejecutar linter
bunx --yes tsc --noEmit                           # Verificar tipos
```

## Comandos para PowerShell

### Creación del Proyecto desde Cero

```powershell
# Crear la estructura de carpetas del monorepo
New-Item -Path "remove-background/apps", "remove-background/packages" -ItemType Directory -Force
Set-Location -Path remove-background

# Inicializar el proyecto raíz
bun init -y
```

### Configuración del Frontend (Next.js 15)

```powershell
# Navegar a la carpeta de aplicaciones
Set-Location -Path apps

# Crear la aplicación Next.js 15 usando bunx (sin instalación global)
bunx --yes create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
Set-Location -Path ..
```

### Configuración del Backend (Express)

🔗 Ver documentación completa: [Guía del Backend](../comandos-backend.md)

```powershell
# Navegar a la carpeta de aplicaciones
Set-Location -Path apps

# Crear la carpeta para la API y navegar a ella
New-Item -Path "api" -ItemType Directory -Force
Set-Location -Path api

# Inicializar el proyecto
bun init -y

# Instalar dependencias de Express
bun add express cors helmet
bun add -d @types/express @types/cors typescript ts-node

# Inicializar configuración de TypeScript
bunx --yes tsc --init
Set-Location -Path ../..
```

### Creación de Paquete Compartido

```powershell
# Navegar a la carpeta de paquetes
Set-Location -Path packages

# Crear la carpeta para el paquete compartido y navegar a ella
New-Item -Path "shared" -ItemType Directory -Force
Set-Location -Path shared

# Inicializar el proyecto
bun init -y

# Configurar TypeScript para el paquete compartido
bun add -d typescript
bunx --yes tsc --init
Set-Location -Path ../..
```

### Instalación desde Repositorio Existente

```powershell
# Clonar el repositorio
git clone https://github.com/tu-usuario/remove-background.git
Set-Location -Path remove-background

# Instalar dependencias con Bun
bun install
```

### Comandos de Desarrollo

```powershell
# Iniciar todos los servicios en modo desarrollo
bun dev

# O iniciar servicios individualmente
bun --filter frontend dev  # Iniciar solo el frontend
bun --filter api start     # Iniciar solo el backend

# Ejecutar herramientas de desarrollo con bunx
bunx --yes prettier --write "apps/**/*.{ts,tsx}"  # Formatear código
bunx --yes eslint apps/frontend                   # Ejecutar linter
bunx --yes tsc --noEmit                           # Verificar tipos
```

## Notas Importantes

- Los comandos de Bun (`bun`, `bunx`) funcionan igual en bash y PowerShell
- La principal diferencia está en los comandos para crear directorios y navegar entre ellos
- En PowerShell, se usa `Set-Location` en lugar de `cd` y `New-Item` en lugar de `mkdir`
- Para rutas en PowerShell, se pueden usar tanto barras normales (`/`) como invertidas (`\`)

Los servicios usan puertos fijos:
- Frontend: 3000
- Backend: 3001