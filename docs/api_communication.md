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

Este patrón de comunicación, utilizando las API Routes de Next.js como intermediarios, es una práctica común para interactuar con servicios backend, ofreciendo una capa de abstracción, seguridad y permitiendo que el frontend y el backend se desarrollen y escalen de forma independiente.