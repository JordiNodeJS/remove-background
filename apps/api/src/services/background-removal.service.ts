import fs from "fs/promises";
import path from "path";
import removeImageBackground from "../utilities/remove";

// Constantes para mejorar claridad
const OUTPUT_DIR = path.resolve(__dirname, "../../images-output");

/**
 * Asegura que el directorio de salida exista
 */
async function ensureOutputDirectory(): Promise<void> {
  try {
    await fs.access(OUTPUT_DIR);
  } catch {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Procesa la eliminación de fondo de una imagen
 */
export const removeBackgroundFromImage = async (
  file: Express.Multer.File
): Promise<string | undefined> => {
  try {
    // Validación inicial
    if (!file || !file.path) throw new Error("No se recibió archivo válido");

    // Asegurar directorio de salida
    await ensureOutputDirectory();

    // Construir ruta de salida
    const outputPath = path.join(OUTPUT_DIR, `output-${file.filename}`);

    // Procesa imagen
    const fileBuffer = await removeImageBackground(file.path);

    // Registrar información de depuración
    console.log("[DEBUG] fileBuffer length:", fileBuffer.length);

    // Escribir resultado
    await fs.writeFile(outputPath, fileBuffer);

    // Eliminar el archivo original de uploads
    await fs.unlink(file.path); // Línea descomentada para eliminar el archivo original

    return outputPath;
  } catch (error) {
    console.error("Error al eliminar el fondo de la imagen:", error);
    throw new Error("Error al procesar la imagen"); // Línea descomentada para lanzar error
  }
};
