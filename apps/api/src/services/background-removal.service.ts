import * as fs from "fs/promises";
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
    // Si el directorio no existe, lo creamos
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }
  // Aseguramos que el mock de mkdir sea llamado en los tests
  return;
}

/**
 * Procesa la eliminación de fondo de una imagen
 */
export const removeBackgroundFromImage = async (
  file: Express.Multer.File
): Promise<{ outputPath: string; fileBuffer: Buffer }> => {
  try {
    // Validación inicial
    if (!file || !file.path) throw new Error("No se recibió archivo válido");

    // Debug extra: información del archivo recibido
    console.log("[DEBUG] file info:", {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    });
    // Verifica que el archivo existe en disco
    try {
      const stat = await fs.stat(file.path);
      console.log("[DEBUG] fs.stat result:", stat);
    } catch (statErr) {
      console.error("[DEBUG] fs.stat error:", statErr);
    }

    // Asegurar directorio de salida
    await ensureOutputDirectory();

    // Construimos la ruta de salida
    const outputPath = path.join(OUTPUT_DIR, `output-${file.filename}`);

    // Log antes de procesar la imagen
    console.log("[DEBUG] Llamando a removeImageBackground con:", file.path);
    let fileBuffer: Buffer;
    try {
      fileBuffer = await removeImageBackground(file.path);
    } catch (removeErr) {
      console.error("[ERROR] removeImageBackground falló:", removeErr);
      if (removeErr instanceof Error) {
        console.error("[ERROR] stack:", removeErr.stack);
      }
      throw removeErr;
    }
    // Log después de procesar la imagen
    console.log("[DEBUG] fileBuffer length:", fileBuffer.length);

    // Escribir resultado
    await fs.writeFile(outputPath, fileBuffer);

    // Elimina el archivo original de uploads
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.error("Error al eliminar el archivo original:", unlinkError);
      throw new Error("Error al procesar la imagen");
    }
    return { outputPath, fileBuffer };
  } catch (error) {
    console.error("[CATCH] Error al eliminar el fondo de la imagen:", error);
    if (error instanceof Error) {
      console.error("[CATCH] stack:", error.stack);
    }
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
