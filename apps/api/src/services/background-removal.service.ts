import fs from "fs";
import path from "path";

export const removeBackgroundFromImage = async (
  imagePath: string
): Promise<string> => {
  try {
    // Simulación de procesamiento de eliminación de fondo
    const outputPath = path.join(
      __dirname,
      "../images-output",
      `output-${path.basename(imagePath)}`
    );
    fs.copyFileSync(imagePath, outputPath); // Simula la salida
    return outputPath;
  } catch (error) {
    console.error("Error al eliminar el fondo de la imagen:", error);
    throw new Error("Error al procesar la imagen");
  }
};
