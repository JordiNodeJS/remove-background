// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseForm, saveUploadedFile } from "@/lib/image-upload"; // Cambiado saveFile a saveUploadedFile
import { ApiResponse } from "@/lib/types";
import path from "path";
import fs from "fs";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let savedFilePath: string | undefined = undefined;
  let tempPath: string | undefined = undefined;

  try {
    // Parsear el formulario con la imagen
    const { files } = await parseForm(req);
    const imageFile = files.image; // imageFile es ahora File | undefined

    if (!imageFile) {
      return NextResponse.json(
        {
          status: 400,
          message: "No se proporcionó ninguna imagen",
        },
        { status: 400 }
      );
    }

    // Validar el tamaño del archivo
    const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_UPLOAD_FILE_SIZE_MB || "5", 10);
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convertir MB a bytes
    if (imageFile.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          status: 400,
          message: `El archivo es demasiado grande. El tamaño máximo permitido es de ${MAX_FILE_SIZE_MB}MB`,
        },
        { status: 400 }
      );
    }

    // Validar el tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(imageFile.type)) { // Cambiado imageFile.mimetype a imageFile.type
      return NextResponse.json(
        {
          status: 400,
          message:
            "Tipo de archivo no permitido. Solo se aceptan imágenes JPEG y PNG",
        },
        { status: 400 }
      );
    } 
    
    // Guardar la imagen en el directorio de input y obtener su ruta
    savedFilePath = await saveUploadedFile(imageFile); 
    
    // Usamos un enfoque directo con archivos para evitar problemas de streams
    // Creamos un archivo temporal para la subida
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900000000) + 100000000;
    const fileExt = path.extname(imageFile.name || ".png"); // Cambiado imageFile.originalFilename a imageFile.name
    const tempFileName = `temp-${timestamp}-${random}${fileExt}`;
    const configuredTempDir = process.env.TEMP_DIR_PATH || path.join(process.cwd(), "tmp");
    // Usar path.resolve para asegurar una ruta absoluta y normalizada.
    const tempDir = path.resolve(configuredTempDir);
    tempPath = path.join(tempDir, tempFileName);

    // Asegurarse de que el directorio temporal exista
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Copiamos el archivo guardado al directorio temporal
    fs.copyFileSync(savedFilePath, tempPath);
    
    try {
      // Usar fetch para enviar el archivo al API del backend
      const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:3001/remove-background/link";
      
      const formData = new FormData();
      // El backend espera un archivo con el nombre 'image'
      // Necesitamos leer el archivo temporal como un Blob para enviarlo con FormData
      const fileBuffer = fs.readFileSync(tempPath);
      const blob = new Blob([fileBuffer], { type: imageFile.type });
      formData.append("image", blob, imageFile.name);

      const response = await fetch(backendApiUrl, {
        method: "POST",
        body: formData,
        // No es necesario establecer Content-Type manualmente para FormData con fetch,
        // el navegador/Node lo hará automáticamente con el boundary correcto.
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error del backend: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Error del backend: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      const imageUrl = result.data?.url;
      
      if (!imageUrl) {
        console.error("Respuesta del backend no contiene URL de imagen válida:", result);
        throw new Error("La URL de la imagen procesada es inválida o está vacía en la respuesta del backend");
      }
      
      console.log("URL de imagen recibida del backend:", imageUrl);
      
      // Limpieza del archivo temporal y el archivo guardado inicialmente
      try {
        fs.unlinkSync(savedFilePath); // Eliminar el archivo guardado por saveUploadedFile
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.error("Error al eliminar archivos temporales tras procesar en backend:", cleanupError);
      }
      
      const apiResponse: ApiResponse = {
        status: 200,
        message: "Imagen procesada correctamente por el backend",
        data: {
          url: imageUrl,
        },
      };
      
      return NextResponse.json(apiResponse);
    } catch (error) {
      console.error("Error al procesar la imagen del backend:", error);
      
      // Si falla, usamos la imagen original como fallback.
      // El outputFileName ya está definido antes del bloque try-catch principal y se usará.
      
      // Copiamos la imagen original como fallback
      try {
        const outputDir = path.join(process.cwd(), "public/images-output");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const outputPath = path.join(outputDir, `output-${timestamp}-${random}${fileExt}`);
        // Copiar la imagen original (savedFilePath) como fallback
        fs.copyFileSync(savedFilePath, outputPath);
        
        // Limpieza de archivos temporales
        try {
          fs.unlinkSync(savedFilePath); // Eliminar el archivo guardado por saveUploadedFile
          fs.unlinkSync(tempPath);
        } catch (e) {
          console.error("Error al eliminar archivos temporales:", e);
        }
        
        // Construir la URL local para el cliente
        const appBaseUrl = process.env.APP_BASE_URL;
        let localImageUrl;
        if (appBaseUrl) {
          localImageUrl = `${appBaseUrl}/images-output/output-${timestamp}-${random}${fileExt}`;
        } else {
          const host = req.headers.get("host") || "localhost:3000";
          const protocol = host.includes("localhost") ? "http" : "https";
          localImageUrl = `${protocol}://${host}/images-output/output-${timestamp}-${random}${fileExt}`;
        }

        
        const apiResponse: ApiResponse = {
          status: 200,
          message: "No se pudo procesar la imagen en el backend, usando imagen original",
          data: {
            url: localImageUrl,
          },
        };
        
        return NextResponse.json(apiResponse);
      } catch (copyError) {
        console.error("Error al crear imagen fallback:", copyError);
        // Asegurarse de limpiar los archivos temporales incluso si la copia de fallback falla
        try {
          fs.unlinkSync(savedFilePath);
          fs.unlinkSync(tempPath);
        } catch (e) {
          console.error("Error al eliminar archivos temporales durante el error de fallback:", e);
        }
        return NextResponse.json(
          {
            status: 500,
            message: "Error al procesar la imagen",
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error procesando la imagen:", error);

    // Limpieza de archivos en caso de error en el flujo principal
    try {
      if (savedFilePath && fs.existsSync(savedFilePath)) {
        fs.unlinkSync(savedFilePath);
      }
      if (tempPath && fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (cleanupError) {
      console.error("Error al eliminar archivos temporales en el catch principal:", cleanupError);
    }
    
    return NextResponse.json(
      {
        status: 500,
        message: "Error interno del servidor al procesar la imagen",
      },
      { status: 500 }
    );
  }
}
