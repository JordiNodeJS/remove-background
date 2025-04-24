## Comandos Backend (Express 5)

```bash
# Iniciar servidor en desarrollo (modo workspace)
bun run dev:all

# Alternativa específica para backend
bun run --filter=@remove-background/api dev

# Ejecutar directamente
bun --filter=@remove-background/api run src/index.ts
```

Configuración clave:
- Runtime Bun para TypeScript nativo
- Express 5 con sistema de módulos ESM
- Configuración de seguridad con Helmet
- Soporte para CORS y middlewares modernos

Dependencias principales:
- `express@5.1.0`
- `helmet@8.1.0`
- `cors@2.8.5`
- `typescript@5.8.3`