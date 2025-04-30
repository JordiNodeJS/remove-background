import fs from "fs/promises";
import path from "path";

export const removeBackgroundFromImage = async (
  file: Express.Multer.File
): Promise<string> => {
  try {
    // Log para depuración
    console.log("[DEBUG] file recibido:", file);
    if (!file || !file.path) throw new Error("No se recibió archivo válido");

    // Asegura que la carpeta de salida sea siempre apps/api/images-output
    const outputDir = path.resolve(__dirname, "../../images-output");
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `output-${file.filename}`);

    // Leer el contenido binario del archivo original
    const fileContent = await fs.readFile(file.path);

    // Escribir el contenido binario en la nueva ubicación
    await fs.writeFile(outputPath, fileContent);

    // Eliminar el archivo original de uploads
    await fs.unlink(file.path);

    return outputPath;
  } catch (error) {
    console.error("Error al eliminar el fondo de la imagen:", error);
    throw new Error("Error al procesar la imagen");
  }
};
