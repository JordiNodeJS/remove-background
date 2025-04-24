# Documentación del Backend

## Configuración de Express con Bun

### Requisitos previos
- Bun versión 1.x
- Node.js 18+

### Estructura de directorios
```
apps/api/
├── src/
│   ├── controllers/    # Controladores de endpoints
│   ├── middleware/     # Middlewares personalizados
│   ├── routes/         # Definiciones de rutas
│   └── utils/          # Utilidades compartidas
├── tsconfig.json       # Configuración TypeScript
└── package.json        # Dependencias y scripts
```

## Configuración TypeScript
La configuración del compilador se encuentra en <mcfile name="tsconfig.json" path="apps/api/tsconfig.json"></mcfile>.

Principales opciones:
- Target: ESNext
- Módulos ESM
- Strict type checking
- Compatibilidad con Bun

## Comandos clave

```bash
# Ejecutar en modo desarrollo
bun run dev

# Construir para producción
bun run build

# Ejecutar tests
bun test
```

## Despliegue
Recomendado usar:
- Docker con imagen oficial de Bun
- Plataformas como Railway o Render

[Ver instrucciones completas de Copilot](../../.github/copilot-instructions.md)