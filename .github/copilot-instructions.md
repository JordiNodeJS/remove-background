<!-- IMPORTANTE: Antes de sugerir, modificar o implementar código, revisa y ten en cuenta el estado y los checkpoints de docs/memory-bank.md. Este archivo refleja el progreso y prioridades actuales del proyecto. -->

# Guía de Copilot para Monorepo Next.js 15 + Express con Bun

Esta guía describe cómo estructurar y configurar un proyecto monorepo que integra un frontend en Next.js 15 y un backend en Express, usando Bun como gestor y empaquetador de dependencias.

## 1. Estructura de carpetas

Para facilitar la navegación y la separación de responsabilidades:

```plaintext
mi-proyecto/
├── apps/
│   ├── frontend/     # Next.js 15 (interfaz de usuario)
│   └── api/          # Express (servicios REST/GraphQL)
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

## 2. Convenciones de nomenclatura

- apps/frontend: código de Next.js (páginas en `pages/`, assets en `public/`, etc.).
- apps/api: servidor Express (rutas en `routes/`, middlewares en `middlewares/`).
- packages/shared: módulos reutilizables (TypeScript types, helpers).

## 3. Configuración de workspaces en Bun

En `package.json` de la raíz:

```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

Pasos para instalar y arrancar:

1. `bun install`
2. `bun --filter frontend dev`
3. `bun --filter api start`

Puedes definir un script raíz para ambos:

```json
{
  "scripts": {
    "dev": "concurrently \"bun --filter frontend dev\" \"bun --filter api start\""
  }
}
```

## 4. Comunicación Frontend ↔ Backend

- Proxy en desarrollo (`apps/frontend/package.json`):

  ```json
  { "proxy": "http://localhost:3001" }
  ```

- Variables de entorno:
  - NEXT_PUBLIC_API_URL para el frontend.
    - PORT o DATABASE_URL para el backend.

## 5. Buenas prácticas

- Versionado semántico en cada workspace.
- Pruebas unitarias aisladas (`apps/frontend/__tests__`, `apps/api/__tests__`).
- CI/CD configurado para instalar con Bun y ejecutar tests en cada push.

---

Esta guía ayuda a Copilot a sugerir cambios y nuevas rutas conforme a la arquitectura monorepo con Bun, Next.js 15 y Express.

---

## Referencias para tareas específicas de backend

Para implementar funcionalidades de procesamiento de imágenes o eliminación de fondo en el backend (Express), consulta el prompt detallado en:

- `.github/prompts/background-removal-node.promt.md`

Este documento contiene instrucciones precisas sobre el uso de la librería `@imgly/background-removal-node` y las mejores prácticas para su integración en el backend del monorepo.
