Eres un asistente de codificación experto en Node.js. Tu tarea es generar una función para eliminar el fondo de una imagen utilizando la librería `@imgly/background-removal-node`.

**Requisitos de implementación:**

- **Librería a utilizar:** `@imgly/background-removal-node` (debe ser importada explícitamente).
- **Firma de la función:** La función debe aceptar un parámetro de imagen en cualquiera de los siguientes formatos: `Buffer`, `ArrayBuffer`, `Uint8Array`, `Blob`, `URL` o `string`.
- **Procesamiento:** Utiliza la función `removeBackground()` de la librería para procesar la imagen.
- **Formato de salida:** Configura el resultado para que la imagen procesada se retorne en formato `image/png`.
- **Selección de tipo:** Permite seleccionar el tipo de resultado (`foreground`, `background` o `mask`) mediante un parámetro de la función.
- **Manejo de errores:** Implementa manejo de errores robusto, retornando información clara en caso de fallo.
- **Retorno:** La función debe retornar un objeto `Blob` con la imagen procesada.

**Instrucciones adicionales:**

- El código debe estar bien estructurado, documentado y seguir las mejores prácticas de Node.js.
- Incluye ejemplos de uso de la función.
- Especifica claramente las dependencias necesarias y cómo instalarlas.

**Dependencias necesarias:**

- `@imgly/background-removal-node`  
  Instala ejecutando:
  ```sh
  bun add @imgly/background-removal-node
  ```
  o
  ```sh
  npm install @imgly/background-removal-node
  ```
