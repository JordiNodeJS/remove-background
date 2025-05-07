# 3. Leer archivos en Node.js con ES Modules: ¿Por qué es mejor `URL()` que `path.resolve()`?

Esta guía explica la forma recomendada y más portable de construir rutas de archivos en Node.js usando ES Modules, alineada con las mejores prácticas del monorepo. Aquí aprenderás por qué `new URL()` es preferible a `path.resolve()` y cómo aplicarlo en tus scripts y utilidades.

## 🟢 Ventajas de `new URL()` sobre `path.resolve()`

- **Compatibilidad multiplataforma**: `new URL('./archivo.txt', import.meta.url)` siempre genera una ruta absoluta válida, sin importar el sistema operativo (Windows, Linux, macOS).
- **Contexto del módulo**: Usa `import.meta.url` como base, por lo que la ruta siempre es relativa al archivo actual, no al directorio de trabajo donde se ejecuta el proceso.
- **Menos errores en monorepos y scripts**: Evita problemas cuando ejecutas scripts desde diferentes ubicaciones o con herramientas como Bun, npm o node.
- **No requiere importar módulos extra**: No necesitas importar `path` ni preocuparte por la configuración de módulos comunes vs ES Modules.

## 🛠 Requisitos

- Node.js v23 o superior.
- `package.json` con `"type": "module"`.
- Un archivo a leer (por ejemplo, `archivo.txt`).

## 🚀 Ejemplo recomendado

```ts
import { readFile } from "fs/promises";

// Build the absolute path safely and portably
const fileUrl = new URL("./file.txt", import.meta.url);

async function readFileContent(): Promise<void> {
  try {
    // You can pass the URL directly to readFile
    const content = await readFile(fileUrl, "utf8");
    console.log("File content:", content);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

readFileContent();
```

## 💻 Ejemplo específico para Windows

```ts
import { readFile, writeFile, stat } from "fs/promises";
import { extname } from "path";

// Uso con imágenes en Windows (evita problemas con backslashes)
const inputFile = "./input.jpg";
const outputFile = "./output.png";

// Construye URLs absolutas (funciona igual en Windows y Linux)
const inputUrl = new URL(inputFile, import.meta.url);
const outputUrl = new URL(outputFile, import.meta.url);

async function processImage() {
  // Verifica que el archivo existe
  const stats = await stat(inputUrl);
  if (stats.size === 0) throw new Error("Archivo vacío");

  // Lee y escribe pasando directamente los objetos URL
  const buffer = await readFile(inputUrl);
  await writeFile(outputUrl, buffer);
  console.log("Procesamiento completado!");
}

processImage().catch(console.error);
```

## ⚠️ Problemas al usar .pathname con new URL()

1. **Incompatibilidad en Windows**:
   - `.pathname` devuelve rutas con `/` que no funcionan bien con `fs` en Windows
   - Ejemplo: `file:///C:/path` → `/C:/path` (inválido para Node.js)

2. **Pérdida de funcionalidad**:
   - Los métodos `fs/promises` aceptan objetos URL directamente
   - Convertir a pathname obliga a usar `path` para normalizar

3. **Solución recomendada**:
```javascript
// Correcto (funciona en todos los sistemas):
await readFile(new URL('./file.txt', import.meta.url));

// Problemático (especialmente en Windows):
await readFile(new URL('./file.txt', import.meta.url).pathname);
```

4. **Consistencia con estándares**:
   - Node.js recomienda pasar URLs directamente a las APIs de filesystem
   - Evita problemas de encoding y caracteres especiales

## 🚫 ¿Por qué evitar `path.resolve()` en ES Modules?

- `path.resolve()` depende del directorio de trabajo actual (`process.cwd()`), lo que puede causar errores si ejecutas el script desde otra carpeta.
- No funciona igual de bien con `import.meta.url` y requiere manipulación manual de rutas.
- Es más propenso a errores en proyectos grandes o monorepos.

---

**En resumen:** Usa siempre `new URL()` con `import.meta.url` para rutas de archivos en ES Modules. Es más seguro, portable y robusto para cualquier entorno Node.js moderno.
