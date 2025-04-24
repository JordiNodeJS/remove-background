# Reglas del Proyecto para Trae AI

Este documento contiene las reglas y directrices para el asistente Trae AI al trabajar con este proyecto monorepo que integra Next.js 15 y Express con Bun.

## Referencia a las Instrucciones de Copilot

Este proyecto sigue las mismas directrices definidas en el archivo de instrucciones de Copilot. Para mantener la consistencia entre ambos asistentes de IA, por favor consulta y sigue las reglas definidas en:

[Instrucciones de Copilot](../../.github/copilot-instructions.md)

## Estructura del Proyecto

Sigue la estructura de carpetas definida en las instrucciones de Copilot:

```plaintext
mi-proyecto/
├── apps/
│   ├── frontend/     # Next.js 15 (interfaz de usuario)
│   └── api/          # Express (servicios REST/GraphQL)
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

## Convenciones y Buenas Prácticas

- Respeta las convenciones de nomenclatura establecidas
- Utiliza la configuración de workspaces de Bun
- Sigue las directrices para la comunicación entre Frontend y Backend
- Implementa las buenas prácticas de versionado y pruebas

---

Este archivo asegura que Trae AI siga las mismas directrices que Copilot al asistir con este proyecto monorepo.