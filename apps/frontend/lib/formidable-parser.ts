// lib/formidable-parser.ts
import { IncomingForm } from "formidable";
import { NextRequest } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";

export async function formidableParser(req: NextRequest) {
  // Crear un directorio temporal para los archivos subidos
  const tempDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Configuración del formidable
  const form = new IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  // Convertir la nextRequest en un flujo que formidable pueda manejar
  const buffer = await req.arrayBuffer();
  const readable = new Readable({
    read() {
      this.push(Buffer.from(buffer));
      this.push(null);
    },
  });

  // Añadir cabeceras necesarias para formidable
  const contentType = req.headers.get("content-type") || "multipart/form-data";
  Object.defineProperty(readable, "headers", {
    value: {
      "content-type": contentType,
    },
  });

  // Procesar el formulario
  return new Promise((resolve, reject) => {
    form.parse(readable as any, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}
