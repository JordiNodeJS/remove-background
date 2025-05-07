# 6. Comandos Frontend (Next.js 15)

Esta guía recopila los comandos y configuraciones clave para desarrollar y ejecutar el frontend Next.js 15 del monorepo Remove Background usando Bun. Incluye alternativas y características principales del entorno frontend.

```bash
# Desarrollo
bun run dev:frontend

# Alternativas
npm run dev --workspace=@remove-background/frontend

# Ejecutar con Turbopack
bun run --filter=@remove-background/frontend dev
```

Características clave:

- Configuración TurboPack integrada
- Soporte para React 19
- Sistema de compilación optimizado con Bun
