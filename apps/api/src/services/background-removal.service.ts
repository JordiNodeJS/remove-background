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
    // Obtiene la extensión original
    const ext = path.extname(file.originalname) || "";
    // Elimina la extensión si ya está incluida en file.filename
    let baseName = file.filename;
    if (baseName.endsWith(ext)) {
      baseName = baseName.slice(0, -ext.length);
    }
    const outputPath = path.join(outputDir, `output-${baseName}${ext}`);
    fs.copyFileSync(file.path, outputPath); // Simula la salida
    return outputPath;
  } catch (error) {
    console.error("Error al eliminar el fondo de la imagen:", error);
    throw new Error("Error al procesar la imagen");
  }
};
