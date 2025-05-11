// lib/image-upload.ts
import * as fs from "fs";
import * as path from "path";
import { File, Files } from "formidable";
import { NextRequest } from "next/server";
import { formidableParser } from "./formidable-parser";

export const saveFile = async (file: File): Promise<string> => {
  // Asegurar que el directorio existe
  const uploadDir = path.join(process.cwd(), "public/images-input");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generar un nombre de archivo único
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 900000000) + 100000000;
  const fileExt = path.extname(file.originalFilename || "");
  const fileName = `input-${timestamp}-${random}${fileExt}`;

  const outputPath = path.join(uploadDir, fileName);

  // Leer el archivo y guardarlo en el directorio de destino
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(outputPath, data);

  // No eliminamos el archivo temporal todavía, lo necesitamos para la API
  // Lo eliminaremos después de completar la petición al servicio externo

  // Devolver la ruta pública al archivo
  return `/images-input/${fileName}`;
};

export const parseForm = async (
  req: NextRequest
): Promise<{ fields: Record<string, string>; files: Files }> => {
  return formidableParser(req) as Promise<{
    fields: Record<string, string>;
    files: Files;
  }>;
};
