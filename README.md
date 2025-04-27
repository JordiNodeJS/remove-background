# Remove Background

## Descripción

Este proyecto es una aplicación web para eliminar fondos de imágenes de manera automática utilizando técnicas avanzadas de procesamiento de imágenes e inteligencia artificial. Permite a los usuarios subir imágenes, eliminar sus fondos y descargar el resultado con fondo transparente o personalizado.

## Estructura del Proyecto

Este es un proyecto monorepo que integra Next.js 15 para el frontend y Express con Bun para el backend. La estructura recomendada es la siguiente:

```plaintext
remove-background/
├── apps/
│   ├── frontend/     # Next.js 15 (interfaz de usuario)
│   │   ├── app/      # Páginas y layouts principales
│   │   └── public/   # Archivos estáticos y assets
│   └── api/          # Express (servicios REST)
│       ├── src/
│       │   ├── routes/        # Definición de rutas Express
│       │   ├── controllers/   # Lógica de negocio
│       │   ├── middlewares/   # Middlewares personalizados
│       │   ├── models/        # Modelos o validaciones
│       │   ├── utils/         # Funciones utilitarias
│       │   ├── index.ts       # Punto de entrada del servidor
│       │   └── remove.ts      # Script de procesamiento de imágenes
│       └── images-output/     # Archivos generados (imágenes procesadas)
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

Para más detalles sobre la estructura y organización de la API REST, consulta [docs/estructura-api-rest.md](docs/estructura-api-rest.md).

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

### Configuración de workspaces en Bun

En el `package.json` de la raíz:

```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

### Instalación desde repositorio existente

```bash
bun install
```

### Arranque de servicios

```bash
# Iniciar todos los servicios en modo desarrollo
bun dev

# O iniciar servicios individualmente
bun --filter frontend dev  # Iniciar solo el frontend
bun --filter api start     # Iniciar solo el backend
```

Puedes definir un script raíz para ambos:

```json
{
  "scripts": {
    "dev": "concurrently \"bun --filter frontend dev\" \"bun --filter api start\""
  }
}
```

## Comunicación Frontend ↔ Backend

- Proxy en desarrollo (`apps/frontend/package.json`):

  ```json
  { "proxy": "http://localhost:3001" }
  ```

- Variables de entorno:
  - `NEXT_PUBLIC_API_URL` para el frontend.
  - `PORT` o `DATABASE_URL` para el backend.

## Buenas prácticas

- Versionado semántico en cada workspace.
- Pruebas unitarias aisladas (`apps/frontend/__tests__`, `apps/api/__tests__`).
- CI/CD configurado para instalar con Bun y ejecutar tests en cada push.

---

Esta guía ayuda a mantener la arquitectura monorepo clara y escalable usando Bun, Next.js 15 y Express.

---

## Referencias para tareas específicas de backend

Para implementar funcionalidades de procesamiento de imágenes o eliminación de fondo en el backend (Express), consulta:

- [docs/estructura-api-rest.md](docs/estructura-api-rest.md)
- `.github/prompts/background-removal-node.promt.md`

Estos documentos contienen instrucciones precisas sobre la estructura de la API REST y el uso de la librería `@imgly/background-removal-node`.
