// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { ApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log(`[remove-background POST] __dirname: ${__dirname}`);
  console.log(`[remove-background POST] process.cwd(): ${process.cwd()}`);
  
  let tempFilePath = ""; // Initialize, will be set if file is processed

  try {
    // Parsear directamente el formData
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { status: 400, message: "No se proporcionó ninguna imagen" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Tipo de archivo no permitido. Solo se aceptan imágenes JPEG y PNG",
        },
        { status: 400 }
      );
    }

    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900000000) + 100000000;
    const fileExt = imageFile.name.match(/\.[0-9a-z]+$/i)?.[0] || ".png";
    const tempFileName = `temp-${timestamp}-${random}${fileExt}`;
    tempFilePath = path.join(tempDir, tempFileName);

    const arrayBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

    const backendFormData = new FormData();
    const fileContent = fs.readFileSync(tempFilePath);
    const blob = new Blob([new Uint8Array(fileContent)], { type: imageFile.type });
    backendFormData.append("image", blob, imageFile.name || "image.png");

    // FORZAR backendServiceUrl a localhost:3001 para desarrollo local
    const backendServiceUrl = "http://localhost:3001";
    console.log(
      `[remove-background route] FORZANDO backendServiceUrl a: ${backendServiceUrl} para desarrollo local.`
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    console.log(
      `[remove-background route] Attempting to send image to Express backend at: ${backendServiceUrl}/remove-background/link`
    );

    let response;
    try {
      response = await fetch(`${backendServiceUrl}/remove-background/link`, {
        method: "POST",
        body: backendFormData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Error al eliminar tempFilePath en catch de fetch", e); }
      }
      let errorDetails = "No additional details available.";
      if (error instanceof Error) {
        errorDetails = `Name: ${error.name}, Message: ${error.message}`;
        if (error.cause) {
          try {
            errorDetails += ` | Cause: ${JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause))}`;
          } catch (_) {
            errorDetails += ` | Cause: (Could not stringify - ${String(error.cause)})`;
          }
        }
      }
      console.error(
        "[remove-background route] Error al conectar con el backend:",
        error,
        "Formatted Details:",
        errorDetails
      );
      return NextResponse.json(
        { status: 500, message: "No se pudo conectar con el servicio de procesamiento de imágenes.", errorDetails },
        { status: 500 }
      );
    }

    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Error al eliminar tempFilePath después de fetch exitoso", e); }
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[remove-background route] Error del backend: ${response.status}`, errorBody);
      return NextResponse.json(
        { status: response.status, message: "Error al procesar la imagen en el servidor externo", errorDetails: errorBody },
        { status: response.status }
      );
    }

    const result = await response.json();
    const imageUrl = result.data?.url;

    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error("La URL de la imagen procesada del backend es inválida o está vacía:", imageUrl);
      return NextResponse.json(
        { status: 500, message: "Error al obtener la URL de la imagen procesada del backend." },
        { status: 500 }
      );
    }

    console.log("[remove-background route] URL de imagen recibida del backend y para ser usada por el cliente:", imageUrl);

    const apiResponse: ApiResponse = {
      status: 200,
      message: "Imagen procesada correctamente",
      data: { url: imageUrl },
    };
    return NextResponse.json(apiResponse);

  } catch (error) {
    // Catch general para errores inesperados durante el procesamiento inicial (antes del fetch)
    console.error("[remove-background route] Error general en el procesamiento de la imagen (antes de llamar al backend):", error);
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Error al eliminar tempFilePath en catch general", e); }
    }
    let errorDetails = "No additional details available.";
    if (error instanceof Error) {
      errorDetails = `Name: ${error.name}, Message: ${error.message}`;
      if (error.cause) {
        try {
          errorDetails += ` | Cause: ${JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause))}`;
        } catch (_) {
          errorDetails += ` | Cause: (Could not stringify - ${String(error.cause)})`;
        }
      }
    }
    return NextResponse.json(
      { status: 500, message: "Error interno del servidor al procesar la imagen.", errorDetails },
      { status: 500 }
    );
  }
}
