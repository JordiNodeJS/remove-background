// app/api/mock-remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parsear el formulario multipart
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        {
          status: 400,
          message: "No image provided",
        },
        { status: 400 }
      );
    }

    // Validar el tipo de archivo
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          status: 400,
          message: "Invalid file type. Only JPEG and PNG are allowed.",
        },
        { status: 400 }
      );
    }

    // Crear directorios si no existen
    const outputDir = path.join(process.cwd(), "public/images-output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generar un nombre único para el archivo de salida
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900000000) + 100000000;
    const fileExt = imageFile.name.match(/\.[0-9a-z]+$/i)?.[0] || ".png";
    const outputFileName = `output-${timestamp}-${random}${fileExt}`;
    const outputPath = path.join(outputDir, outputFileName);

    // Convertir la imagen a un Buffer y guardarla
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    fs.writeFileSync(outputPath, imageBuffer);

    // En un caso real, aquí procesaríamos la imagen para quitar el fondo
    // Para este mock, simplemente usamos la misma imagen

    // Construir la URL para el cliente
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const imageUrl = `${protocol}://${host}/images-output/${outputFileName}`;

    // Esperar un poco para simular el procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      status: 200,
      message: "Imagen procesada correctamente...",
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Error processing image",
      },
      { status: 500 }
    );
  }
}
