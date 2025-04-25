import { removeBackground, type Config } from "@imgly/background-removal-node";
import { readFile, writeFile, stat } from "fs/promises";
import { extname } from "path";

// Rutas relativas para las imágenes de entrada y salida
const inputFile = "./input-01.jpg";
const outputFile = "./output-01";

// Construcción de URLs absolutas relativas a este módulo (recomendado para ESM y multiplataforma)
// Usar objetos URL directamente con fs/promises evita problemas de rutas en Windows y es seguro en cualquier sistema operativo.
const inputUrl = new URL(inputFile, import.meta.url);
const outputUrl = new URL(outputFile, import.meta.url);

async function removeImageBackground() {
  // Verifica que el archivo existe y no está vacío
  const stats = await stat(inputUrl);
  if (stats.size === 0) throw new Error("El archivo de entrada está vacío o corrupto");

  // Comprobación explícita de extensión soportada
  const ext = extname(inputFile).toLowerCase();
  const formatosSoportados = [".jpg", ".jpeg", ".png"];
  if (!formatosSoportados.includes(ext)) {
    // Mensaje de error detallado para formatos no soportados
    throw new Error(`Extensión no soportada: ${ext}. Solo se permiten: ${formatosSoportados.join(", ")}`);
  }

  // Leer el archivo usando el objeto URL directamente (evita problemas de rutas en Windows)
  const inputBuffer = await readFile(inputUrl);
  console.log("[DEBUG] inputBuffer length:", inputBuffer.length);
  console.log("[DEBUG] inputBuffer type:", Object.prototype.toString.call(inputBuffer));
  console.log("[DEBUG] inputBuffer slice (primeros 16 bytes):", inputBuffer.subarray(0, 16));
  console.log("[DEBUG] inputFile:", inputFile, "ext:", ext);

  // Determinar el tipo MIME según la extensión
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
  };
  const mimeType = mimeTypes[ext as keyof typeof mimeTypes];
  if (!mimeType) {
    throw new Error(`No se pudo determinar el tipo MIME para la extensión: ${ext}`);
  }

  // Crear un Blob con el tipo MIME correcto
  const inputBlob = new Blob([inputBuffer], { type: mimeType });

  // Procesa la imagen para eliminar el fondo
  try {
    const config: Config = {
      debug: true,
      model: "medium",
      output: {
        format: "image/png"
      }
    };
    
    // Asignar valor predeterminado si output no está definido
    if (!config.output) {
      config.output = { format: "image/png" };
    }
    const outputBlob = await removeBackground(inputBlob, config);
    // Buffer.from convierte el resultado (Blob) en un Buffer compatible con Node.js
    const outputBuffer = Buffer.from(await outputBlob.arrayBuffer());
    // Determinar extensión de salida según el tipo MIME del resultado
    const outputMime = config.output?.format || 'image/png';
    const outputExtMap = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/x-alpha8": ".png",
      "image/x-rgba8": ".png",
      "image/webp": ".webp"
    };
    const outputExt = outputExtMap[outputMime] || ".bin";
    const outputFileWithExt = outputFile + outputExt;
    const outputUrlWithExt = new URL(outputFileWithExt, import.meta.url);
    await writeFile(outputUrlWithExt, outputBuffer);
    console.log("¡Fondo eliminado correctamente!");
  } catch (err) {
    console.error("[ERROR] removeBackground falló:", err instanceof Error ? err.message : String(err));
    throw err;
  }
}

removeImageBackground().catch((error) => {
  // Manejo de errores mejorado: muestra el mensaje y termina el proceso
  console.error("Error al eliminar el fondo:", error.message || error);
  process.exit(1);
});

// ¿Por qué usar objetos URL en vez de path.resolve o .pathname?
// - Pasar un objeto URL a los métodos de fs/promises es multiplataforma y evita problemas de rutas (especialmente en Windows)
// - URL con import.meta.url siempre es relativa al módulo, no al cwd del proceso
// - No es necesario manipular ni normalizar rutas manualmente
// - Es el enfoque recomendado para ESM en Node.js y Bun
