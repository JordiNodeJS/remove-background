// lib/image-upload.ts
import * as fs from "fs";
import * as path from "path";
// Importación de formidable y formidableParser eliminada ya que no se usarán más
import { NextRequest } from "next/server";

// Definición del tipo para el archivo de imagen para mayor claridad
// No es estrictamente necesario si solo se usa File directamente, pero puede ser útil.
// Por ahora, usaremos File directamente de lib.dom.d.ts que NextRequest usa.

/**
 * Guarda un archivo subido (objeto File de la Web API) en el disco.
 * @param file El objeto File a guardar.
 * @returns La ruta completa del archivo guardado.
 */
export const saveUploadedFile = async (file: File): Promise<string> => {
  // Asegurar que el directorio existe
  const uploadDir = path.join(process.cwd(), "public/images-input");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generar un nombre de archivo único
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 900000000) + 100000000;
  const fileExt = path.extname(file.name || ".png"); // Usar file.name para la extensión
  const fileName = `input-${timestamp}-${random}${fileExt}`;

  const outputPath = path.join(uploadDir, fileName);

  // Leer el archivo como ArrayBuffer y luego guardarlo
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  // Devolver la ruta completa al archivo guardado en el sistema de archivos
  return outputPath;
};

/**
 * Parsea el FormData de una NextRequest para obtener el archivo de imagen.
 * @param req La NextRequest entrante.
 * @returns Un objeto que contiene el archivo de imagen bajo la clave 'image'.
 */
export const parseForm = async (
  req: NextRequest
): Promise<{ files: { image?: File } }> => {
  const formData = await req.formData();
  const imageFile = formData.get("image") as File | null;

  if (!imageFile) {
    return { files: {} }; // Devuelve un objeto vacío si no hay archivo
  }

  // Devolvemos una estructura similar a la anterior para minimizar cambios en el consumidor
  return { files: { image: imageFile } };
};

// La función original saveFile se elimina o se reemplaza por saveUploadedFile.
// La función original parseForm que usaba formidableParser se reemplaza.
