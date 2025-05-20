// lib/formidable-parser.ts
import { NextRequest } from "next/server";
import formidable from "formidable";

// Define the Files type to include all required properties
export interface FormidableFile {
  filepath: string;
  originalFilename?: string | null;
  mimetype?: string | null;
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
    // Convert NextRequest to Node's IncomingMessage-like object
    // This is a simplified proxy and might not cover all edge cases
    const reqProxy = {
      headers: Object.fromEntries(req.headers),
      method: req.method,
      url: req.url,
      // formidable expects a stream, so we need to provide one.
      // In Next.js 13+, req.body is a ReadableStream.
      // We can pipe this stream to formidable.
      pipe: (destination: any) => {
        if (!req.body) {
          destination.end();
          return destination;
        }
        const reader = req.body.getReader();
        const processChunk = ({
          done,
          value,
        }: {
          done: boolean;
          value?: Uint8Array;
        }) => {
          if (done) {
            destination.end();
            return;
          }
          destination.write(value);
          reader.read().then(processChunk);
        };
        reader.read().then(processChunk);
        return destination;
      },
      // Add other properties formidable might expect, like `on` for event listeners,
      // although formidable's `parse` method primarily uses the stream.
      on: (event: string, _listener: (...args: any[]) => void) => {
        // Prefix listener with _ to indicate it's unused
        // Basic implementation for 'close' event if needed by formidable
        if (event === "close") {
          // In a serverless environment, the request lifecycle is different.
          // We might not have a traditional 'close' event.
          // For now, we can potentially call this after parsing is complete,
          // or rely on formidable's internal stream handling.
        }
      },
    } as any; // Use 'any' for simplicity due to the proxy nature

    const form = formidable({
      multiples: true,
      keepExtensions: true,
      // You might want to configure uploadDir if you need to save files to disk
      // uploadDir: './temp_uploads', // Example: specify a temporary directory
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
        // Ensure value is an array of formidable.File or undefined
        const fileArray = Array.isArray(value) ? value : value ? [value] : [];

        const validFiles: formidable.File[] = fileArray.filter(
          (f): f is formidable.File => f !== undefined && f !== null // Type guard
        );

        if (validFiles.length > 0) {
          // Process only if there are valid files
          files[key] = validFiles.map((file: formidable.File) => ({
            // Now file is guaranteed to be formidable.File
            filepath: file.filepath,
            originalFilename: file.originalFilename,
            mimetype: file.mimetype,
            size: file.size,
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
        }
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
