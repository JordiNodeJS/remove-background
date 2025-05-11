// app/api/remove-background/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { ApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parsear directamente el formData (evitando el uso de formidable que causa el error _transform)
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

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
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          status: 400,
          message:
            "Tipo de archivo no permitido. Solo se aceptan imágenes JPEG y PNG",
        },
        { status: 400 }
      );
    }

    // Guardar la imagen en un directorio temporal
    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generar nombre único para el archivo temporal
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900000000) + 100000000;
    const fileExt = imageFile.name.match(/\.[0-9a-z]+$/i)?.[0] || ".png";
    const tempFileName = `temp-${timestamp}-${random}${fileExt}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    // Guardar el archivo temporal
    const arrayBuffer = await imageFile.arrayBuffer();
    fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

    // Crear una nueva instancia de FormData para la solicitud al backend
    const backendFormData = new FormData();

    // Crear un Blob a partir del archivo guardado
    const fileContent = fs.readFileSync(tempFilePath);
    const blob = new Blob([new Uint8Array(fileContent)], {
      type: imageFile.type,
    });

    // Añadir el blob al FormData
    backendFormData.append("image", blob, imageFile.name || "image.png"); // Realizar la petición al servicio externo con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    console.log(`Enviando imagen a: ${backendUrl}/remove-background/link`);

    let response;
    try {
      response = await fetch(`${backendUrl}/remove-background/link`, {
        method: "POST",
        body: backendFormData,
        signal: controller.signal,
      });

      // Limpiar el timeout
      clearTimeout(timeoutId);
    } catch (error) {
      // Limpiar el timeout y el archivo temporal
      clearTimeout(timeoutId);
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkError) {
        console.error("Error al eliminar el archivo temporal:", unlinkError);
      }

      console.error("Error al conectar con el backend:", error);
      return NextResponse.json(
        {
          status: 500,
          message:
            "No se pudo conectar con el servicio de procesamiento de imágenes",
        },
        { status: 500 }
      );
    }
    if (!response.ok) {
      // Limpiar archivos temporales
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error("Error al eliminar el archivo temporal:", error);
      }

      return NextResponse.json(
        {
          status: response.status,
          message: "Error al procesar la imagen en el servidor externo",
        },
        { status: 500 }
      );
    }

    // Procesar la respuesta del backend
    const result = await response.json();

    // Descargar la imagen procesada del backend y guardarla localmente
    try {
      console.log("URL de imagen recibida del backend:", result.data.url);
      const imageUrl = result.data.url;

      // Verificar si la URL es válida
      if (!imageUrl) {
        throw new Error(
          "La URL de la imagen procesada es inválida o está vacía"
        );
      }

      console.log("Descargando imagen desde:", imageUrl);

      // Descargar la imagen desde la URL
      const imageResponse = await fetch(imageUrl, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!imageResponse.ok) {
        throw new Error(
          `Error al descargar la imagen procesada: ${imageResponse.status}`
        );
      }

      // Verificar que la respuesta contiene una imagen
      const contentType = imageResponse.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error(`La respuesta no es una imagen: ${contentType}`);
      }

      // Leer los bytes de la imagen
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      if (imageBuffer.length === 0) {
        throw new Error("La imagen descargada está vacía");
      }

      console.log(
        `Imagen descargada correctamente: ${imageBuffer.length} bytes`
      );

      // Guardar en el directorio local
      const outputDir = path.join(process.cwd(), "public/images-output");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputFileName = `output-${timestamp}-${random}${fileExt}`;
      const outputPath = path.join(outputDir, outputFileName);
      fs.writeFileSync(outputPath, imageBuffer);

      console.log(`Imagen guardada localmente en: ${outputPath}`);

      // Limpiar archivos temporales
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error("Error al eliminar el archivo temporal:", error);
      }

      // Construir la URL local para el cliente
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      const localImageUrl = `${protocol}://${host}/images-output/${outputFileName}`;

      console.log(`URL para el cliente: ${localImageUrl}`);

      // Construir la respuesta según el formato esperado
      const apiResponse: ApiResponse = {
        status: 200,
        message: "Imagen procesada correctamente",
        data: {
          url: localImageUrl,
        },
      };

      return NextResponse.json(apiResponse);
    } catch (error) {
      console.error("Error al procesar la imagen del backend:", error);

      // Si falla, proporcionamos una respuesta fallback usando la imagen original
      try {
        const outputDir = path.join(process.cwd(), "public/images-output");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFileName = `output-${timestamp}-${random}${fileExt}`;
        const outputPath = path.join(outputDir, outputFileName);

        // Usar la imagen original como fallback
        fs.copyFileSync(tempFilePath, outputPath);

        // Limpiar archivos temporales
        try {
          fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.error("Error al eliminar el archivo temporal:", e);
        }

        // Construir la URL local para el cliente
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const localImageUrl = `${protocol}://${host}/images-output/${outputFileName}`;

        const apiResponse: ApiResponse = {
          status: 200,
          message:
            "No se pudo procesar la imagen en el backend, usando imagen original",
          data: {
            url: localImageUrl,
          },
        };

        return NextResponse.json(apiResponse);
      } catch (copyError) {
        console.error("Error al crear imagen fallback:", copyError);

        // Si todo falla, devolver la URL original del backend
        const apiResponse: ApiResponse = {
          status: 200,
          message: "Imagen procesada pero no pudo guardarse localmente",
          data: {
            url: result.data?.url || "/placeholder-error.png",
          },
        };

        return NextResponse.json(apiResponse);
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
