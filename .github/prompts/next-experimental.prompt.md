**Prompt para IA Generativa (Next.js 15 + Gestor de Imágenes)**

"Genera una aplicación web completa en **Next.js 15** que cumpla con los siguientes requisitos técnicos y funcionales:

---

### **1. Configuración del Proyecto**

#### **1.1. Estructura Monorepo**

- Utiliza Bun como gestor de dependencias y entorno de ejecución
- Configura un monorepo con la siguiente estructura:
  ```
  /
  ├── apps/
  │   ├── frontend/     # Next.js 15 (interfaz de usuario)
  │   └── api/          # Express (servidor backend)
  ├── packages/         # Paquetes compartidos (opcional)
  ├── package.json      # Config raíz con workspaces
  └── bun.lockb         # Lockfile de Bun
  ```

#### **1.2. Configuración del Backend**

- En apps/api, implementa un servidor Express con los siguientes endpoints:
  - `POST /remove-background/link`: Procesa imágenes y elimina el fondo
  - `GET /images-output/:filename`: Sirve imágenes procesadas estáticamente
- Utiliza `multer` para el manejo de archivos subidos

---

### **2. Gestión de Imágenes**

#### **2.1. Carga y Procesamiento**

- Crea un formulario para cargar imágenes desde el dispositivo local.
- Al enviar una imagen, realiza una solicitud POST al endpoint `http://localhost:3001/remove-background/link` con el siguiente formato:
  ```bash
  curl -X POST http://localhost:3001/remove-background/link \
    -H "Content-Type: multipart/form-data" \
    -F "image=@input-01.png"
  ```
- Maneja la respuesta del servidor, que devuelve un objeto JSON como este:
  ```json
  {
    "status": 200,
    "message": "Imagen procesada correctamente...",
    "data": {
      "url": "http://localhost:3001/images-output/output-1746907260873-596650149.png"
    }
  }
  ```

#### **2.2. Almacenamiento**

- En el backend:
  - Guarda las imágenes originales en `images-input/`
  - Guarda las imágenes procesadas en `images-output/`
  - Configura Express para servir estos directorios estáticamente
- Asegúrate de añadir nombres únicos a las imágenes (usando timestamps)

---

### **3. Interfaz de Comparación**

- Diseña una interfaz que muestre **dos imágenes lado a lado**:
  - Imagen original (izquierda).
  - Imagen procesada (derecha).
- Implementa una **barra vertical deslizable** para comparar ambas imágenes
- Usa la biblioteca `react-compare-image` para la comparación deslizable
- Ejemplo de implementación:

  ```jsx
  import ReactCompareImage from "react-compare-image";

  export default function ImageComparisonComponent({ before, after }) {
    return (
      <div className="comparison-container">
        <ReactCompareImage
          leftImage={before}
          rightImage={after}
          sliderPositionPercentage={0.5}
          handle={<CustomHandle />}
        />
      </div>
    );
  }
  ```

---

### **4. Flujo de la Aplicación**

1. El usuario sube una imagen mediante un formulario en el frontend
2. El frontend envía la imagen al backend mediante una solicitud POST
3. El backend procesa la imagen (elimina el fondo) y devuelve la URL de la imagen procesada
4. El frontend muestra ambas imágenes (original y procesada) en el componente de comparación
5. El usuario puede deslizar para comparar ambas imágenes

---

### **5. Configuración de CORS y Comunicación**

- Añade la configuración necesaria en el backend para permitir peticiones desde el frontend:
  ```javascript
  // En el servidor Express
  const cors = require("cors");
  app.use(
    cors({
      origin: "http://localhost:3000", // URL del frontend
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );
  ```
- En el frontend, configura las llamadas API para manejar correctamente los CORS

---

### **6. Estructura de Carpetas Frontend**

```
apps/frontend/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout de la app
│   └── api/                  # API routes (opcional)
├── components/
│   ├── ImageComparison.tsx   # Componente de comparación
│   ├── ImageUploader.tsx     # Formulario de carga
│   └── ui/                   # Componentes UI reutilizables
├── lib/
│   └── api.ts                # Funciones para llamadas API
└── public/                   # Assets estáticos
```

---

### **7. Estilización y UI**

- Utiliza Tailwind CSS para los estilos
- Implementa un diseño responsive que funcione en móviles y desktop
- Añade estados de carga (loading) durante el procesamiento de imágenes
- Implementa toasts o notificaciones para informar sobre el resultado del proceso

---

### **8. Manejo de Errores**

- Implementa manejo detallado de errores en el frontend y backend
- En el frontend:
  - Muestra mensajes de error específicos si la imagen es demasiado grande
  - Implementa validación de tipos de archivo (.jpg, .png)
- En el backend:
  - Proporciona mensajes de error descriptivos cuando el procesamiento falla
  - Maneja casos de timeout o errores del servicio

---

### **9. Scripts de Ejecución**

En el package.json principal, añade:

```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "concurrently \"bun --filter frontend dev\" \"bun --filter api start\"",
    "build": "bun --filter frontend build",
    "start": "concurrently \"bun --filter frontend start\" \"bun --filter api start\""
  }
}
```

---

### **10. Documentación**

- Incluye un README.md detallado con:
  - Instrucciones de instalación y ejecución
  - Explicación de la arquitectura
  - Ejemplos de uso del API
  - Requisitos del sistema

---

Este prompt está optimizado para generar una aplicación funcional de procesamiento de imágenes con Next.js 15 en el frontend y Express en el backend, utilizando Bun como gestor de dependencias en una estructura de monorepo.
