// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseForm, saveUploadedFile } from "@/lib/image-upload"; // Cambiado saveFile a saveUploadedFile
import { ApiResponse } from "@/lib/types";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
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
    const savedFilePath = await saveUploadedFile(imageFile); 
    
    // Usamos un enfoque directo con archivos para evitar problemas de streams
    // Creamos un archivo temporal para la subida
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900000000) + 100000000;
    const fileExt = path.extname(imageFile.name || ".png"); // Cambiado imageFile.originalFilename a imageFile.name
    const tempFileName = `temp-${timestamp}-${random}${fileExt}`;
    const tempPath = path.join(process.cwd(), "tmp", tempFileName);
    
    // Copiamos el archivo guardado al directorio temporal
    fs.copyFileSync(savedFilePath, tempPath);
    
    try {
      // Usar curl directamente para enviar el archivo al API
      const apiUrl = "http://localhost:3001/remove-background/link";
      const curlCmd = `curl -s -X POST ${apiUrl} -H "Content-Type: multipart/form-data" -F "image=@${tempPath}"`;
      const backendResponse = execSync(curlCmd).toString();
      
      // Parsear la respuesta
      const result = JSON.parse(backendResponse);
      
      // Obtener la URL de la imagen procesada
      const imageUrl = result.data.url;
      
      if (!imageUrl) {
        throw new Error("La URL de la imagen procesada es inválida o está vacía");
      }
      
      console.log("URL de imagen recibida del backend:", imageUrl);
      
      // Limpieza del archivo temporal y el archivo guardado inicialmente
      // Estos archivos se crearon para enviar la imagen al backend.
      // Ya no necesitamos descargar la imagen del backend al frontend si el procesamiento fue exitoso.
      try {
        fs.unlinkSync(savedFilePath); // Eliminar el archivo guardado por saveUploadedFile
        fs.unlinkSync(tempPath);
      } catch (error) {
        console.error("Error al eliminar archivos temporales tras procesar en backend:", error);
      }
      
      // Construir la respuesta según el formato esperado
      // Devolvemos directamente la URL de la imagen procesada por el backend.
      const apiResponse: ApiResponse = {
        status: 200,
        message: "Imagen procesada correctamente por el backend",
        data: {
          url: imageUrl, // Usar la URL del backend directamente
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
    
    return NextResponse.json(
      {
        status: 500,
        message: "Error interno del servidor al procesar la imagen",
      },
      { status: 500 }
    );
  }
}
