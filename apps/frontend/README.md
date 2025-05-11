# Eliminador de Fondos con Next.js 15

Una aplicación web basada en Next.js 15 para eliminar fondos de imágenes mediante una API externa.

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

## API Backend

Esta aplicación se comunica con un servicio backend para el procesamiento de imágenes. El endpoint principal es:

- `POST /remove-background/link`: Elimina el fondo de una imagen

### Ejemplo de Uso con cURL

```bash
curl -X POST http://localhost:3001/remove-background/link \
  -H "Content-Type: multipart/form-data" \
  -F "image=@input-01.png"
```

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
  page.tsx                      # Página principal
/public
  /images-input                 # Directorio para imágenes originales
  /images-output                # Directorio para imágenes procesadas
```
