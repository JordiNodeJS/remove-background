import fs from "fs";
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
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `output-${file.filename}`);
    fs.copyFileSync(file.path, outputPath); // Simula la salida
    return outputPath;
  } catch (error) {
    console.error("Error al eliminar el fondo de la imagen:", error);
    throw new Error("Error al procesar la imagen");
  }
};
