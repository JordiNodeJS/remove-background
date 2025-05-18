import { removeBackground, type Config } from "@imgly/background-removal-node";
import { readFile, writeFile, stat, mkdir, access } from "fs/promises";
import { extname, resolve } from "path";

// Configuración y constantes
const inputFile = "../../../../input-01.png";
const outputFile = "../../images-output/output-01";
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

// Ruta personalizada para los modelos
const modelDir = resolve(__dirname, "../bg-removal-models");

async function ensureModelDirExists() {
  try {
    await access(modelDir);
  } catch {
    await mkdir(modelDir, { recursive: true });
  }
}

export default async function removeImageBackground(
  filePath: string
): Promise<Buffer> | never {
  if (filePath === undefined) {
    throw new Error("El archivo de entrada no puede ser undefined");
  }
  if (filePath === null) {
    throw new Error("El archivo de entrada no puede ser null");
  }
  if (filePath === "") {
    throw new Error("El archivo de entrada no puede ser una cadena vacía");
  }

  // Verifica que el archivo existe y no está vacío
  console.log("[DEBUG] filePath:", filePath);
  console.log("[DEBUG] __dirname:", __dirname);
  console.log("[DEBUG] __filename:", __filename);
  console.log("[DEBUG] import.meta.url:", import.meta.url);
  console.log("[DEBUG] process.cwd():", process.cwd());

  // Asegura que el directorio de modelos existe
  await ensureModelDirExists();

  // 1. Verifica que el archivo existe y no está vacío
  const stats = await stat(filePath);
  if (stats.size === 0)
    throw new Error("El archivo de entrada está vacío o corrupto");

  // 2. Comprobación de extensión soportada
  const ext = extname(filePath).toLowerCase();
  if (!supportedFormats.includes(ext)) {
    throw new Error(
      `Extensión no soportada: ${ext}. Solo se permiten: ${supportedFormats.join(", ")}`
    );
  }

  // 3. Leer el archivo de entrada
  const inputBuffer = await readFile(filePath);

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
      }
    };
    config.output ??= { format: "image/png" };
    config.output.format ??= "image/png";

    // Función sleep para el retardo artificial
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Aplicar retardo de 1 minuto
    
    const outputBlob = await removeBackground(inputBlob, config);
    const outputBuffer = Buffer.from(await outputBlob.arrayBuffer());
    await sleep(15000);
    
    return outputBuffer;
  } catch (err) {
    console.error(
      "[ERROR] removeBackground falló:",
      err instanceof Error ? err.message : String(err)
    );
    throw err;
  }
}

// Notas sobre el uso de objetos URL con fs/promises:
// - Es multiplataforma y evita problemas de rutas (especialmente en Windows)
// - Siempre relativo al módulo, no al cwd del proceso
// - No requiere manipulación manual de rutas
// - Recomendado para ESM en Node.js y Bun
