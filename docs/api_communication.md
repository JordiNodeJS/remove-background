# Comunicación con el Backend (API)

Esta sección detalla cómo la aplicación frontend se comunica con el servicio backend para el procesamiento de imágenes.

## API Backend

La aplicación frontend interactúa con un servicio backend que se encarga de la lógica de eliminación de fondos. El endpoint principal expuesto por el backend para esta funcionalidad es:

- `POST /remove-background/link`: Este endpoint recibe una imagen y devuelve la versión sin fondo.

### Ejemplo de Uso con cURL

A continuación, se muestra un ejemplo de cómo se puede invocar este endpoint utilizando cURL. Esto es útil para pruebas o para entender la estructura de la petición:

```bash
curl -X POST http://localhost:3001/remove-background/link \
  -H "Content-Type: multipart/form-data" \
  -F "image=@input-01.png"
```

**Parámetros de la Petición:**

- **URL:** `http://localhost:3001/remove-background/link` (o la URL configurada para tu API backend).
- **Método:** `POST`.
- **Headers:**
    - `Content-Type: multipart/form-data`: Indica que se está enviando un formulario con datos binarios (la imagen).
- **Body (form-data):**
    - `image`: El archivo de imagen que se va a procesar. En el ejemplo de cURL, `@input-01.png` indica que se debe leer el contenido del archivo `input-01.png` y enviarlo como parte del campo `image`.

Este endpoint es fundamental para la funcionalidad principal de la aplicación, permitiendo que el frontend delegue la tarea intensiva de procesamiento de imágenes al backend.

## Flujo de Comunicación Frontend-Backend

A continuación, se detalla el flujo de comunicación entre el frontend (Next.js) y el backend (Express) para el procesamiento de imágenes, utilizando las API Routes de Next.js como intermediarios:

1.  **Solicitud del Cliente:**
    *   El usuario interactúa con la interfaz de usuario en el navegador (cliente) y selecciona una imagen para eliminar el fondo.

2.  **Llamada a la API Route del Frontend:**
    *   El componente de React en el frontend realiza una solicitud (generalmente `POST`) a una API Route específica dentro de la aplicación Next.js (por ejemplo, `/api/remove-background`).
    *   Esta solicitud incluye la imagen seleccionada, típicamente como `FormData`.

3.  **Proxy al Backend (API Route de Next.js):**
    *   La API Route de Next.js actúa como un proxy o intermediario.
    *   Recibe la solicitud del cliente y, en lugar de procesar la imagen directamente, reenvía la solicitud (incluyendo la imagen) al endpoint correspondiente del servicio backend de Express (por ejemplo, `http://localhost:3001/remove-background/link`).
    *   Esta capa de API Route en Next.js puede manejar la autenticación, validación adicional, o transformación de datos antes de contactar al backend.

4.  **Procesamiento en el Backend (Express):**
    *   El servidor backend de Express recibe la solicitud de la API Route de Next.js.
    *   Ejecuta el modelo de inteligencia artificial para eliminar el fondo de la imagen.
    *   Este proceso puede ser intensivo y tomar tiempo, dependiendo de los recursos del servidor y el tamaño de la imagen.

5.  **Respuesta al Frontend API Route:**
    *   Una vez que el backend ha procesado la imagen, envía una respuesta de vuelta a la API Route de Next.js.
    *   Esta respuesta típicamente incluye la imagen procesada (sin fondo) o una URL a la misma, junto con cualquier información de estado (éxito o error).

6.  **Respuesta al Cliente:**
    *   La API Route de Next.js recibe la respuesta del backend.
    *   Procesa esta respuesta si es necesario (por ejemplo, formateándola) y la envía de vuelta al cliente (navegador) que originó la solicitud.

7.  **Actualización de la UI:**
    *   El componente de React en el frontend recibe la respuesta de su propia API Route.
    *   Actualiza la interfaz de usuario para mostrar la imagen procesada, permitir su descarga, o mostrar un mensaje de error si el proceso falló.

---

# Análisis Arquitectónico y Control de la Comunicación en el Monorepo

## 1. Inspección de la estructura del monorepo

El proyecto sigue una estructura monorepo clara y modular:

- **apps/frontend/**: Contiene la aplicación Next.js 15 (interfaz de usuario), con rutas API propias en `app/api/` y componentes React.
- **apps/api/**: Implementa el backend Express, con rutas REST, controladores, servicios y configuración de endpoints para procesamiento de imágenes.
- **packages/shared/**: Paquete compartido para tipos, utilidades o lógica común entre frontend y backend.
- **docs/**: Documentación técnica y guías.
- **package.json** y **bun.lockb**: Configuración raíz de workspaces y dependencias gestionadas con Bun.

Archivos clave identificados:
- `apps/frontend/app/api/remove-background/route.ts`: API Route principal del frontend que actúa como proxy.
- `apps/api/src/routes/remove-background.route.ts`: Define los endpoints REST del backend para la eliminación de fondo.
- `apps/api/package.json` y `apps/frontend/package.json`: Scripts de arranque, dependencias y puntos de entrada.
- `apps/api/src/index.ts` y `apps/api/src/app.ts`: Bootstrap del backend Express.

## 2. Análisis del mecanismo de comunicación

### Frontend (Next.js)
- El usuario selecciona una imagen en la UI.
- El componente React envía la imagen mediante un `POST` a `/api/remove-background` usando `FormData`.
- La API Route (`route.ts`) valida y guarda la imagen, luego ejecuta un comando `curl` para reenviar la imagen al backend Express (`http://localhost:3001/remove-background/link`).
- El resultado del backend se procesa y se responde al cliente.

**Fragmento relevante (pseudocódigo):**
```typescript
// apps/frontend/app/api/remove-background/route.ts
export async function POST(req: NextRequest) {
  // ...
  const apiUrl = "http://localhost:3001/remove-background/link";
  const curlCmd = `curl -s -X POST ${apiUrl} -H "Content-Type: multipart/form-data" -F "image=@${tempPath}"`;
  const backendResponse = execSync(curlCmd).toString();
  // ...
}
```

### Backend (Express)
- El endpoint `/remove-background/link` recibe la imagen mediante `multipart/form-data`.
- Usa `multer` para gestionar la subida y almacenamiento temporal.
- El controlador procesa la imagen usando el modelo de IA y responde con la imagen sin fondo o una URL.
- Middlewares: manejo de CORS, seguridad (`helmet`), logging y validación de archivos.

**Fragmento relevante (pseudocódigo):**
```typescript
// apps/api/src/routes/remove-background.route.ts
router.post(
  "/link",
  upload.single("image"),
  removeBackgroundLinkController
);
```

### Integración y flujo
- La comunicación es **sincrónica** y basada en HTTP REST.
- No se detecta uso de API Gateway externo ni bus de eventos; la API Route de Next.js actúa como proxy y capa de validación.
- La autenticación y validación adicional pueden implementarse en la API Route o en middlewares del backend.

## 3. Evaluación de patrones y dependencias
- Arquitectura modular, con separación clara de frontend, backend y librerías compartidas.
- Uso de workspaces Bun para gestión de dependencias y scripts.
- El patrón de proxy en Next.js permite desacoplar el frontend del backend y facilita la integración de lógica adicional (autenticación, validación, transformación de datos).
- El backend utiliza middlewares estándar (CORS, helmet, multer) y controladores bien definidos.
- No se detectan sistemas de eventos ni microservicios desacoplados; el flujo es directo y controlado por rutas y controladores.

## 4. Síntesis y recomendaciones

**Fortalezas:**
- Separación de responsabilidades y modularidad.
- Uso de API Routes como proxy, facilitando la seguridad y el control de acceso.
- Documentación clara del flujo de comunicación y ejemplos prácticos.
- Uso de middlewares para robustez y seguridad.

**Áreas de mejora:**
- Considerar la implementación de autenticación y autorización en la API Route y/o backend.
- Mejorar el manejo de errores y logging centralizado.
- Evaluar la posibilidad de usar llamadas HTTP nativas (fetch/axios) en vez de `execSync` con `curl` para mayor portabilidad y control.
- Si el sistema escala, considerar la introducción de un API Gateway o patrones de microservicios/eventos.

**Conclusión:**
La arquitectura del monorepo es robusta, clara y extensible. El control de la comunicación entre frontend y backend se implementa mediante API Routes que actúan como proxy, permitiendo validación, seguridad y desacoplamiento. El backend Express está bien estructurado y preparado para escalar o integrar nuevas funcionalidades.
    *   El componente de React en el frontend recibe la respuesta de su propia API Route.
    *   Actualiza la interfaz de usuario para mostrar la imagen procesada, permitir su descarga, o mostrar un mensaje de error si el proceso falló.

Este patrón de comunicación, utilizando las API Routes de Next.js como intermediarios, es una práctica común para interactuar con servicios backend, ofreciendo una capa de abstracción, seguridad y permitiendo que el frontend y el backend se desarrollen y escalen de forma independiente.