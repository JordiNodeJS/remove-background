# Banco de Memoria y Progreso del Proyecto

## Última actualización: 2025-05-15

---

## Checkpoints (PRD)

### 1.EM Estructura del Monorepo

- [x] 1.1.EM Estructura de carpetas creada según la guía (apps/frontend, apps/api, packages/shared)
- [x] 1.2.EM Configuración de workspaces en `package.json` raíz
- [x] 1.3.EM Uso de Bun como gestor de dependencias

---

### 2.B Backend (apps/api)

- [x] 2.1.B Configuración básica de Express
- [x] 2.2.B Endpoint para recibir imágenes con Multer
- [x] 2.3.B Servicio `background-removal.service.ts` creado
- [x] 2.4.B Carpeta `images-output` generada dinámicamente
- [x] 2.5.B Instalación de la librería `background-removal-node`
- [ ] 2.6.B Integración real de `background-removal-node` en el servicio
- [ ] 2.7.B Eliminación automática del archivo original tras procesar
- [x] 2.8.B Pruebas unitarias del servicio de imágenes (test creado)
- [x] 2.9.B Documentación de endpoints y comandos de test en docs

---

### 3.F Frontend (apps/frontend)

- [x] 3.1.F Proyecto Next.js 15 inicializado
- [ ] 3.2.F Página principal `/` para subir imágenes y mostrar resultados
- [ ] 3.3.F Configuración de proxy a backend en desarrollo
- [x] 3.4.F Conexión real con el backend (API) - _Estabilizada y robustecida la carga de imágenes procesadas._
- [ ] 3.5.F Pruebas unitarias de componentes principales

---

### 4.PC Paquetes Compartidos (packages/shared)

- [ ] 4.1.PC Creación de módulo de tipos TypeScript compartidos
- [ ] 4.2.PC Helpers/utilidades reutilizables

---

### 5.CD Configuración y DevOps

- [x] 5.1.CD Scripts de desarrollo y arranque con Bun y concurrently
- [x] 5.2.CD Variables de entorno documentadas y configuradas en docs
- [ ] 5.3.CD Configuración de CI/CD para instalar con Bun y ejecutar tests

---

## Logros y Soluciones Recientes (2025-05-15)

- **Resolución de Error `net::ERR_SSL_PROTOCOL_ERROR` en Frontend:**

  - **Problema:** El frontend no podía cargar la imagen procesada debido a un error de protocolo SSL. La URL de la imagen (`localImageUrl`) se generaba incorrectamente con `https://` cuando el servidor de desarrollo Next.js (ej. en `http://ec2-34-246-184-131.eu-west-1.compute.amazonaws.com:3000`) servía los activos sobre `http://`.
  - **Solución:** Se implementó una lógica robusta en `apps/frontend/app/api/remove-background/route.ts` para determinar el protocolo correcto:
    1. Se prioriza el header `x-forwarded-proto`.
    2. Si no existe, se infiere el protocolo de `req.url`.
    3. Se aplica una **anulación a `http`** para la URL de la imagen si el `host` corresponde a entornos de desarrollo conocidos que sirven sobre HTTP (como la IP específica de EC2 en el puerto 3000, o `localhost`).
    4. Se mejoró el parseo del `host` y se añadió logging extensivo para depuración.
  - **Impacto:** Se corrigió la carga de imágenes procesadas, permitiendo la visualización y comparación en el frontend. Esto fortalece el checkpoint 3.4.F.

- **Resolución de Error `AbortError: This operation was aborted` (Timeout) en Frontend API Route:**
  - **Problema:** La ruta API del frontend (`apps/frontend/app/api/remove-background/route.ts`) experimentaba timeouts al llamar al backend (`apps/api`) para el procesamiento de imágenes. El error se manifestaba como un `AbortError` en los logs del frontend, indicando que la operación de `fetch` era abortada. Esto ocurría porque el tiempo de procesamiento en el backend, que incluye la descarga de modelos de IA y la eliminación del fondo, excedía el tiempo de espera por defecto (o el configurado inicialmente) en la ruta API del frontend.
  - **Diagnóstico:** Los logs del backend mostraban tiempos de procesamiento superiores a los timeouts configurados en el frontend (inicialmente 30s, luego 43s+). La consola del navegador en el frontend y los logs de la API del frontend mostraban el `AbortError` y el mensaje "This operation was aborted".
  - **Solución:** Se incrementó progresivamente el `timeout` en la llamada `fetch` dentro de `apps/frontend/app/api/remove-background/route.ts`. El `AbortController` configurado para la petición `fetch` se ajustó para permitir un tiempo de espera mayor, estableciéndose finalmente en 120 segundos (2 minutos).
  - **Impacto:** Al aumentar el tiempo de espera, la ruta API del frontend ahora espera lo suficiente para que el backend complete tareas de larga duración como el procesamiento de imágenes, resolviendo los `AbortError` y permitiendo que el flujo completo de eliminación de fondo funcione correctamente. Esto también refuerza el checkpoint 3.4.F.

---

## Memory Bank — Remove Background

## Últimos cambios y decisiones

- **Autenticación Clerk:**
  - Login, registro y recuperación implementados con Clerk.
  - Landing page ahora es catch-all (`[[...rest]]/page.tsx`).
  - Middleware Clerk actualizado para excluir rutas públicas (`/`, `/sign-up`, `/forgot-password`).
  - Eliminar `app/page.tsx` para evitar conflictos.
- **Dashboard:**
  - Protegido, solo accesible tras login.
  - Muestra el componente de procesamiento de imágenes.
- **Health check:**
  - Si el frontend falla al arrancar, verificar que el backend esté corriendo y el endpoint `/api/health` responda.
- **Estilos:**
  - Animaciones y diseño moderno en login y registro.

## Prioridades actuales

- Mantener la separación de rutas públicas y privadas.
- Documentar cualquier cambio en la estructura de rutas o autenticación.
- Mejorar mensajes de error y troubleshooting para onboarding de nuevos devs.

## Siguiente feature sugerida

- Página de perfil de usuario (usando Clerk) y gestión de historial de imágenes procesadas.

---

## Notas y Siguientes Pasos

- Actualizar los checkpoints a medida que se completen tareas.
- Mantener este documento como referencia rápida del estado y progreso.
- Consultar `.github/prompts/background-removal-node.promt.md` para detalles de integración de la librería de eliminación de fondo.

---
