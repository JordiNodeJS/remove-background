// lib/formidable-parser.ts
import { NextRequest } from "next/server";
import formidable from "formidable";

// Define the Files type to include all required properties
export interface FormidableFile {
  filepath: string;
  originalFilename?: string;
  mimetype?: string;
  size?: number;
  newFilename: string;
  // Fix: hashAlgorithm debería ser un valor específico, no una función
  hashAlgorithm: false | "sha1" | "md5" | "sha256";
  toJSON(): object;
}

export interface Files {
  [key: string]: FormidableFile[];
}

// Parse the request with formidable
export const formidableParser = async (
  req: NextRequest
): Promise<{ fields: Record<string, string>; files: Files }> => {
  return new Promise((resolve, reject) => {
    // Convert NextRequest to Node's IncomingMessage-like object
    const reqProxy: any = {
      headers: Object.fromEntries(req.headers),
      method: req.method,
      url: req.url,
    };

    // Add necessary stream-like methods
    if (req.body) {
      reqProxy.pipe = (destination: any) => {
        const reader = (req.body as ReadableStream).getReader();

        const processChunk = ({ done, value }: any) => {
          if (done) {
            destination.end();
            return;
          }

          destination.write(value);
          reader.read().then(processChunk);
        };

        reader.read().then(processChunk);
        return destination;
      };
    }

    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(reqProxy, (err, fields, rawFiles) => {
      if (err) {
        reject(err);
        return;
      }

      const safeFields: formidable.Fields = fields || {};

      // Process and transform files to match the expected interface
      const files: Files = {};

      // Convert formidable's files format to our Files format
      Object.entries(rawFiles || {}).forEach(([key, value]) => {
        const fileList = Array.isArray(value) ? value : [value];

        files[key] = fileList.map((file: any) => ({
          ...file,
          newFilename:
            file.newFilename || file.filepath.split("/").pop() || "unknown",
          // Fix: asignar un valor concreto en lugar de una función
          hashAlgorithm: false,
          toJSON: () => ({
            name: file.originalFilename,
            size: file.size,
            type: file.mimetype,
            path: file.filepath,
          }),
        }));
      });

      resolve({
        fields: Object.fromEntries(
          Object.entries(safeFields).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value || "",
          ])
        ),
        files,
      });
    });
  });
};

// Helper function to parse multipart form data from a NextRequest
export const parseFormData = async (
  req: NextRequest
): Promise<{ fields: Record<string, string>; files: Files }> => {
  return formidableParser(req);
};

export default parseFormData;
