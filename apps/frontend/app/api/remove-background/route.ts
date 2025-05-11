// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseForm, saveFile } from "@/lib/image-upload";
import { ApiResponse } from "@/lib/types";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parsear el formulario con la imagen
    const { files } = await parseForm(req);
    const imageFile = files.image as any;

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
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return NextResponse.json(
        {
          status: 400,
          message:
            "Tipo de archivo no permitido. Solo se aceptan imágenes JPEG y PNG",
        },
        { status: 400 }
      );
    } // Guardar la imagen en el directorio de input
    const savedPath = await saveFile(imageFile); // Crear una nueva instancia de FormData para la solicitud externa
    const formData = new FormData();

    // Leemos el archivo como un ArrayBuffer
    const fileContent = fs.readFileSync(imageFile.filepath);

    // Creamos un blob a partir del contenido del archivo
    const blob = new Blob([fileContent], { type: imageFile.mimetype });

    // Añadimos el blob como un archivo al FormData
    formData.append("image", blob, imageFile.originalFilename || "image.png");

    // Realizar la petición al servicio externo
    const response = await fetch(
      "http://localhost:3001/remove-background/link",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          status: response.status,
          message: "Error al procesar la imagen en el servidor externo",
        },
        { status: 500 }
      );
    } // Procesar la respuesta
    const result = await response.json();

    // Ahora que ya hemos usado el archivo temporal, podemos borrarlo
    try {
      fs.unlinkSync(imageFile.filepath);
    } catch (error) {
      console.error("Error al eliminar el archivo temporal:", error);
    }

    // Construir la respuesta según el formato esperado
    const apiResponse: ApiResponse = {
      status: 200,
      message: "Imagen procesada correctamente",
      data: {
        url: result.data.url,
      },
    };

    return NextResponse.json(apiResponse);
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
