# 2. Tutorial básico: Lectura y escritura de archivos en Node.js con fs/promises

Este tutorial es el punto de partida práctico para trabajar con archivos en Node.js dentro del monorepo. Aquí aprenderás a leer, escribir y eliminar archivos (por ejemplo, imágenes) usando fs/promises, siguiendo las mejores prácticas del proyecto.

## 1. Importar el módulo necesario

```js
import * as fs from "fs/promises";
import path from "path";
```

## 2. Asegurar la existencia de un directorio

Antes de escribir un archivo, es recomendable asegurarse de que el directorio de destino exista. Si no existe, lo creamos:

```js
const outputDir = path.resolve(__dirname, "../ruta/directorio");

async function ensureOutputDirectory() {
  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir, { recursive: true });
  }
}
```

## 3. Leer un archivo (por ejemplo, una imagen)

```js
const buffer = await fs.readFile("./ruta/al/archivo.png");
// buffer es un objeto Buffer con el contenido del archivo
```

## 4. Escribir un archivo

```js
await fs.writeFile("./ruta/de/salida/output.png", buffer);
```

## 5. Eliminar un archivo

```js
await fs.unlink("./ruta/al/archivo-a-eliminar.png");
```

## 6. Ejemplo completo: Procesar una imagen

```js
async function procesarImagen(filePath, outputDir) {
  await ensureOutputDirectory();
  const buffer = await fs.readFile(filePath);
  const outputPath = path.join(outputDir, "output.png");
  await fs.writeFile(outputPath, buffer);
  await fs.unlink(filePath); // Elimina el archivo original
  return outputPath;
}
```

## 7. Buenas prácticas y advertencias

- **Manejo de errores:** Siempre utiliza bloques `try/catch` para capturar errores y evitar que tu aplicación se caiga inesperadamente.
- **Rutas en Windows:** Usa siempre `path.resolve` o `path.join` para construir rutas, evitando problemas con las barras invertidas (`\`) y directas (`/`).
- **Buffer:** Para archivos binarios (imágenes, PDFs, etc.), trabaja siempre con objetos `Buffer`.
- **Directorio de trabajo:** Recuerda que `__dirname` apunta al directorio del archivo actual, no al directorio donde ejecutas el comando.

## 8. Manejo de rutas de archivos de forma portable

Trabajar con rutas de archivos de manera portable es fundamental para que tu código funcione correctamente en diferentes sistemas operativos (Windows, Linux, macOS). Aquí te explico los conceptos clave y las mejores prácticas:

### Diferencia entre rutas absolutas y relativas

- **Ruta absoluta:** Especifica la ubicación completa de un archivo o directorio desde la raíz del sistema de archivos. Ejemplo en Windows: `C:\Users\usuario\proyecto\archivo.txt`.
- **Ruta relativa:** Especifica la ubicación en relación al directorio actual (`process.cwd()` o `__dirname`). Ejemplo: `./datos/archivo.txt`.

### ¿Cuándo usar cada una?

- Usa rutas relativas cuando trabajes con archivos dentro de tu proyecto, para facilitar la portabilidad.
- Usa rutas absolutas solo cuando sea imprescindible (por ejemplo, rutas de configuración externas).

### Ejemplos prácticos

**Construir rutas de forma segura y portable:**

```js
import path from "path";

// Unir directorios y archivos de forma portable
const rutaRelativa = path.join(__dirname, "datos", "archivo.txt");

// Resolver una ruta absoluta a partir de una relativa
const rutaAbsoluta = path.resolve("./datos/archivo.txt");
```

**Evitar rutas hardcodeadas:**

```js
// ❌ No recomendado
const ruta = "C:/Users/usuario/proyecto/archivo.txt";

// ✅ Recomendado
const ruta = path.join(__dirname, "archivo.txt");
```

### ¿Por qué es importante?

- Las rutas hardcodeadas pueden fallar en otros sistemas operativos o cuando cambias la estructura del proyecto.
- `path.join` y `path.resolve` gestionan automáticamente las barras y las diferencias entre sistemas.
- Usar `__dirname` asegura que la ruta sea relativa al archivo actual, no al directorio de ejecución.

### Resumen de mejores prácticas

- Siempre usa `path.join` o `path.resolve` para construir rutas.
- Evita concatenar rutas manualmente con `+` o usando barras (`/` o `\`).
- Prefiere rutas relativas dentro del proyecto.
- Usa `__dirname` para rutas relativas al archivo actual.
- Revisa la documentación oficial de [path](https://nodejs.org/api/path.html) para más detalles.

### ¿Por qué se eligen unos métodos sobre otros?

Al trabajar con rutas en Node.js y entornos modernos de JavaScript, es fundamental entender las diferencias y el propósito de cada método:

- **`__dirname`**: Proporciona la ruta absoluta del directorio donde se encuentra el archivo actual. Es ideal para construir rutas relativas al archivo fuente, asegurando que el código funcione correctamente sin importar desde dónde se ejecute el proceso. Esto evita errores cuando el directorio de trabajo cambia o el proyecto se mueve de lugar.
- **`import.meta.url`**: En módulos ECMAScript (ESM), `__dirname` no está disponible. En su lugar, se utiliza `import.meta.url` junto con utilidades como `fileURLToPath` para obtener la ruta del archivo actual. Esto mantiene la portabilidad y compatibilidad con el estándar moderno de módulos.
- **Evitar `process.cwd()`**: Aunque `process.cwd()` devuelve el directorio de trabajo actual del proceso, puede variar dependiendo de cómo se ejecute el script (por ejemplo, desde diferentes carpetas en la terminal o desde scripts de automatización). Esto puede provocar rutas incorrectas o errores difíciles de depurar. Por eso, se recomienda evitarlo para rutas internas del proyecto.

#### Construcción dinámica de rutas

La construcción dinámica de rutas usando `path.join`, `path.resolve`, `__dirname` o `import.meta.url` garantiza que el código sea portable entre sistemas operativos (Windows, Linux, macOS) y entornos de ejecución. Así se evitan errores por diferencias en separadores de rutas (`/` vs `\`) y se facilita el mantenimiento del proyecto.

#### Resumen

- Usa siempre rutas relativas al archivo fuente (`__dirname` o `import.meta.url`) para acceder a recursos internos del proyecto.
- Prefiere `path.join` y `path.resolve` para construir rutas de forma segura.
- Evita `process.cwd()` salvo que realmente necesites la ubicación desde donde se lanzó el proceso (casos muy específicos).
- Así aseguras portabilidad, robustez y menos errores al mover o desplegar tu proyecto en distintos entornos.
- Revisa la documentación oficial de [path](https://nodejs.org/api/path.html) para más detalles.

## 8. Recursos adicionales

- [Documentación oficial de fs/promises](https://nodejs.org/api/fs.html#fspromisesapi)
- [Documentación de path](https://nodejs.org/api/path.html)

---

Este tutorial está basado en el archivo `background-removal.service.ts` del proyecto, donde se aplican estas técnicas para procesar imágenes de manera segura y eficiente.
