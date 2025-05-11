**Prompt para IA Generativa (Next.js 15 + Gestor de Imágenes)**

"Genera una aplicación web completa en **Next.js 15** que cumpla con los siguientes requisitos técnicos y funcionales:

---

### **1. Gestión de Imágenes**

#### **1.1. Carga y Procesamiento**

- Crea un formulario para cargar imágenes desde el dispositivo local.
- Al enviar una imagen, realiza una solicitud POST al endpoint `http://localhost:3001/remove-background/link` con el siguiente formato:
  ```bash
  curl -X POST http://ec2-3-255-188-43.eu-west-1.compute.amazonaws.com:3001/remove-background/link \
    -H "Content-Type: multipart/form-data" \
    -F "image=@input-01.png"
  ```
- Maneja la respuesta del servidor, que devuelve un objeto JSON como este:
  ```json
  {
    "status": 200,
    "message": "Imagen procesada correctamente...",
    "data": {
      "url": "http://ec2-3-255-188-43.eu-west-1.compute.amazonaws.com:3001/images-output/output-1746907260873-596650149.png"
    }
  }
  ```

#### **1.2. Almacenamiento**

- Guarda las imágenes originales y procesadas en directorios separados (`public/images-input/` y `public/images-output/`).
- Asegúrate de que las imágenes sean accesibles mediante URLs estáticas.

---

### **2. Interfaz de Comparación**

- Diseña una interfaz que muestre **dos imágenes lado a lado**:
  - Imagen original (izquierda).
  - Imagen procesada (derecha).
- Implementa una **barra vertical deslizable** para comparar ambas imágenes (similar a Google Maps 'before/after').
- Usa una librería como `react-split` o implementa una solución personalizada con CSS/Grid.

---

### **3. Rutas y API**

#### **3.1. Frontend**

- Página principal (`/`): Formulario de carga y sección de comparación.
- Historial de imágenes procesadas (opcional).

#### **3.2. Backend (API Routes)**

- Crea un endpoint `POST /api/remove-background` que:
  - Reciba la imagen como `multipart/form-data`.
  - Simule o integre el procesamiento (usa el ejemplo del curl como mock si es necesario).
  - Devuelva el JSON especificado.

---

### **4. Tecnologías y Dependencias**

- Usa **Next.js 15** con App Router.
- Usa `multer` o `formidable` para manejar uploads.
- Librerías recomendadas: `react-split`, `axios`, `zod` (opcional para validación).

---

### **5. Estructura de Carpetas**

Sigue esta estructura:

```
/app
  /api
    /remove-background/route.ts
  /components
    ImageComparison.tsx
    UploadButton.tsx
  /lib
    ...
  page.tsx
/public
  /images-input
  /images-output
```

---

### **6. Instrucciones de Ejecución**

- Incluye un archivo `README.md` con:
  - Pasos para instalar dependencias (`npm install`).
  - Variables de entorno necesarias (si aplica).
  - Comandos para iniciar el servidor (`npm run dev`).
  - Ejemplo de prueba con el curl proporcionado.

---

### **7. Requisitos Adicionales**

- Valida que las imágenes sean de tipo `image/png` o `image/jpeg`.
- Muestra notificaciones (toasts) para errores o éxito en la carga.

---

Este prompt está optimizado para que la IA genere todo el código necesario en un solo intento, incluyendo manejo de archivos, integración con APIs y una UI interactiva.
