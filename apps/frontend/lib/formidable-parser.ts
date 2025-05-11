// lib/formidable-parser.ts
import { IncomingForm } from "formidable";
import { NextRequest } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";

// Define tipos específicos para formidable
interface FormidableFields {
  [key: string]: string | string[];
}

interface FormidableFiles {
  [key: string]:
    | {
        filepath: string;
        originalFilename?: string;
        mimetype?: string;
        size?: number;
        [key: string]: unknown;
      }
    | Array<{
        filepath: string;
        originalFilename?: string;
        mimetype?: string;
        size?: number;
        [key: string]: unknown;
      }>;
}

/**
 * Parsea un NextRequest con formdata usando formidable
 * Implementación mejorada para evitar el error ERR_METHOD_NOT_IMPLEMENTED
 */
export async function formidableParser(
  req: NextRequest
): Promise<{ fields: FormidableFields; files: FormidableFiles }> {
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
    maxFiles: 1, // Limitar a un archivo para reducir complejidad
  });

  // Convertir la nextRequest en un buffer
  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Crear un stream Readable implementado completamente
  const stream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
    // Implementación explícita de _destroy para evitar errores de streams
    destroy(err, callback) {
      callback(err);
    },
  });

  // Añadir cabeceras necesarias para formidable
  const contentType = req.headers.get("content-type") || "multipart/form-data";
  Object.defineProperty(stream, "headers", {
    value: {
      "content-type": contentType,
    },
  });

  // Procesar el formulario
  return new Promise<{ fields: FormidableFields; files: FormidableFiles }>(
    (resolve, reject) => {
      form.parse(
        stream as any,
        (error: Error | null, fields: any, files: any) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({
            fields: fields as FormidableFields,
            files: files as unknown as FormidableFiles,
          });
        }
      );
    }
  );
}
