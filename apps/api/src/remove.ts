import { removeBackground, type Config } from "@imgly/background-removal-node";
import { readFile, writeFile, stat } from "fs/promises";
import { extname } from "path";

// Configuración y constantes
const inputFile = "./input-01.jpg";
const outputFile = "../images-output/output-01";
const supportedFormats = [".jpg", ".jpeg", ".png"];
const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};
const outputExtMap = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/x-alpha8": ".png",
  "image/x-rgba8": ".png",
  "image/webp": ".webp",
};

// Construcción de URLs absolutas relativas a este módulo
const inputUrl = new URL(inputFile, import.meta.url);
const outputUrl = new URL(outputFile, import.meta.url);

async function removeImageBackground() {
  // 1. Verifica que el archivo existe y no está vacío
  const stats = await stat(inputUrl);
  if (stats.size === 0)
    throw new Error("El archivo de entrada está vacío o corrupto");

  // 2. Comprobación de extensión soportada
  const ext = extname(inputFile).toLowerCase();
  if (!supportedFormats.includes(ext)) {
    throw new Error(
      `Extensión no soportada: ${ext}. Solo se permiten: ${supportedFormats.join(
        ", "
      )}`
    );
  }

  // 3. Leer el archivo de entrada
  const inputBuffer = await readFile(inputUrl);
  // Debug opcional
  // console.log("[DEBUG] inputBuffer length:", inputBuffer.length);
  // console.log("[DEBUG] inputBuffer type:", Object.prototype.toString.call(inputBuffer));
  // console.log("[DEBUG] inputBuffer slice (primeros 16 bytes):", inputBuffer.subarray(0, 16));

  // 4. Determinar el tipo MIME
  const mimeType = mimeTypes[ext as keyof typeof mimeTypes];
  if (!mimeType) {
    throw new Error(
      `No se pudo determinar el tipo MIME para la extensión: ${ext}`
    );
  }

  // 5. Crear un Blob con el tipo MIME correcto
  const inputBlob = new Blob([inputBuffer], { type: mimeType });

  // 6. Procesar la imagen para eliminar el fondo
  try {
    const config: Config = {
      debug: true,
      model: "medium",
      output: { format: "image/png" },
      progress: (key, current, total) => {
        console.log(`Downloading ${key}: ${current} of ${total}`);
      },
    };
    // Garantiza que config.output.format siempre tenga valor
    config.output ??= { format: "image/png" };
    config.output.format ??= "image/png";

    const outputBlob = await removeBackground(inputBlob, config);
    const outputBuffer = Buffer.from(await outputBlob.arrayBuffer());
    const outputMime = config.output.format;
    const outputExt = outputExtMap[outputMime] || ".bin";
    const outputFileWithExt = outputFile + outputExt;
    const outputUrlWithExt = new URL(outputFileWithExt, import.meta.url);
    await writeFile(outputUrlWithExt, outputBuffer);
    console.log("¡Fondo eliminado correctamente!");
  } catch (err) {
    console.error(
      "[ERROR] removeBackground falló:",
      err instanceof Error ? err.message : String(err)
    );
    throw err;
  }
}

removeImageBackground().catch((error) => {
  console.error("Error al eliminar el fondo:", error.message || error);
  process.exit(1);
});

// Notas sobre el uso de objetos URL con fs/promises:
// - Es multiplataforma y evita problemas de rutas (especialmente en Windows)
// - Siempre relativo al módulo, no al cwd del proceso
// - No requiere manipulación manual de rutas
// - Recomendado para ESM en Node.js y Bun
