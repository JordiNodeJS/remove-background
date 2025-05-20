# Eliminador de Fondos con Next.js 15

> **Importancia del proyecto:**
>
> Este proyecto demuestra que es posible correr un modelo de inteligencia artificial para quitar el fondo de imágenes en servidores VPS básicos y de bajos recursos, como las instancias EC2 más pequeñas de AWS. El procesamiento de cada imagen en una VPS de este tipo puede tomar alrededor de **45 segundos**, mientras que en una computadora local moderna el mismo proceso dura apenas un par de segundos. Esto lo hace ideal para soluciones económicas y autoalojadas de procesamiento de imágenes con IA.

Una aplicación web basada en Next.js 15 para eliminar fondos de imágenes mediante una API propia.

## Características

- Carga de imágenes desde el dispositivo local
- Eliminación de fondo automática de imágenes
- Visualizador comparativo con deslizador para ver antes/después
- Validación de tipos de archivo (solo JPG y PNG)
- Notificaciones de éxito o error

## Requisitos

- Node.js 18.17 o superior (recomendado 20+)
- Bun 1.0.0 o superior

## Instalación

1. Clona este repositorio:

   ```bash
   git clone <url-del-repositorio>
   ```

2. Instala las dependencias:

   ```bash
   cd remove-background
   bun install
   ```

3. Crea los directorios necesarios (si no existen):
   ```bash
   mkdir -p apps/frontend/public/images-input apps/frontend/public/images-output apps/frontend/tmp
   ```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
bun --filter @remove-background/frontend dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Variables de Entorno

Crea un archivo `.env` en la carpeta raíz con los siguientes valores:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Comunicación con el Backend

La información detallada sobre cómo esta aplicación frontend se comunica con el servicio backend para el procesamiento de imágenes se ha movido a la documentación principal del proyecto.

Puedes encontrar más detalles en [Comunicación con la API del Backend](../../../docs/api_communication.md).

## Estructura del Proyecto

```
/app
  /api
    /remove-background/route.ts  # API route para procesar imágenes
  /components
    ImageComparison.tsx          # Comparador visual de imágenes
    ImageProcessor.tsx           # Componente principal
    UploadButton.tsx             # Botón y lógica de carga
  /lib
    image-upload.ts             # Utilidades para manejo de uploads
    mock-utils.ts               # Funciones para pruebas
    types.ts                    # Definiciones de tipos
  [[...rest]]/page.tsx          # Página principal (catch-all para Clerk)
/public
  /images-input                 # Directorio para imágenes originales
  /images-output                # Directorio para imágenes procesadas
```

**Note:** The frontend currently uses `curl` via `child_process.execSync` in `app/api/remove-background/route.ts` to communicate with the backend. It is highly recommended to replace this with a Node.js HTTP client like `axios` or `node-fetch` for better error handling, performance, and security.
