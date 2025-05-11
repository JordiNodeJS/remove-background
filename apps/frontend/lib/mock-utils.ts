// lib/mock-utils.ts
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { ApiResponse } from "./types";

export async function processMockImage(
  inputPath: string
): Promise<ApiResponse> {
  // Simular un retardo de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generar un nombre aleatorio para el archivo de salida
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 900000000) + 100000000;
  const fileExt = path.extname(inputPath);
  const outputFileName = `output-${timestamp}-${random}${fileExt}`;

  // Asegurarse de que el directorio existe
  const outputDir = path.join(process.cwd(), "public/images-output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Ruta completa al archivo de salida
  const outputPath = path.join(outputDir, outputFileName);

  // Para esta simulación, simplemente copiamos la imagen original
  // En una implementación real, aquí se llamaría al servicio de eliminación de fondo
  const inputFilePath = path.join(process.cwd(), "public", inputPath);
  fs.copyFileSync(inputFilePath, outputPath);

  // Devolver una respuesta similar a la del servidor real
  return {
    status: 200,
    message: "Imagen procesada correctamente...",
    data: {
      url: `/images-output/${outputFileName}`,
    },
  };
}
