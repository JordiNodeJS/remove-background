# 5. Comandos Backend (Express 5)

Esta guía recopila los comandos y configuraciones clave para desarrollar, ejecutar y testear el backend Express del monorepo Remove Background usando Bun. Incluye ejemplos para desarrollo, ejecución directa y pruebas automatizadas.

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

# Cómo ejecutar los tests de integración y unitarios del backend (Express) con Bun

Este documento explica cómo lanzar los tests ubicados en `apps/api/src/__tests__` usando Bun como runner en el monorepo.

## Ubicación de los tests

- **Test unitario:**
  - `apps/api/src/__tests__/background-removal.service.test.ts`
- **Test de integración:**
  - `apps/api/src/__tests__/remove-background.integration.test.ts`

## Pasos para ejecutar los tests

1. Abre una terminal en la raíz del proyecto.
2. Instala las dependencias (si no lo has hecho antes):

   ```sh
   bun install
   ```

3. Ejecuta todos los tests del backend:

   ```sh
   bun --filter api test
   ```

   Esto ejecutará todos los archivos de test en `apps/api`.

4. Para ejecutar un test específico, puedes indicar la ruta relativa al archivo:

   ```sh
   bun --filter api test src/__tests__/remove-background.integration.test.ts
   bun --filter api test src/__tests__/background-removal.service.test.ts
   ```

## Notas

- Puedes usar la opción `--watch` para ejecutar los tests automáticamente al guardar cambios:

  ```sh
  bun --filter api test --watch
  ```

- Los tests usan mocks para evitar procesamiento real de imágenes.
- Consulta la guía principal del monorepo para más detalles sobre la estructura y convenciones.
