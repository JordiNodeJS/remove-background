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
    backendFormData.append("image", blob, imageFile.name || "image.png");

    // Realizar la petición al servicio externo con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos de timeout

    // Determine the backend URL for server-to-server communication.
    // Prefer 'localhost' to avoid hairpin NAT or firewall issues with public IPs for loopback.
    let backendServiceUrl: string;
    const publicApiUrlFromEnv = process.env.NEXT_PUBLIC_API_URL; // e.g., http://ec2-instance.com:3001

    if (publicApiUrlFromEnv) {
      try {
        const parsedPublicUrl = new URL(publicApiUrlFromEnv);
        // If NEXT_PUBLIC_API_URL is set (e.g. for EC2), construct the internal URL using its port.
        // This assumes the backend runs on the same host as this Next.js API route.
        backendServiceUrl = `http://localhost:${
          parsedPublicUrl.port || "3001"
        }`;
        console.log(
          `[remove-background route] NEXT_PUBLIC_API_URL is ${publicApiUrlFromEnv}. Using internal backend URL for server-to-server call: ${backendServiceUrl}`
        );
      } catch (e) {
        console.warn(
          `[remove-background route] Could not parse NEXT_PUBLIC_API_URL ('${publicApiUrlFromEnv}'). Defaulting to http://localhost:3001. Error:`,
          e
        );
        backendServiceUrl = "http://localhost:3001";
      }
    } else {
      // If NEXT_PUBLIC_API_URL is not set, default to localhost:3001.
      backendServiceUrl = "http://localhost:3001";
      console.log(
        `[remove-background route] NEXT_PUBLIC_API_URL not set. Using default internal backend URL for server-to-server call: ${backendServiceUrl}`
      );
    }

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

      let errorDetails = "No additional details available.";
      if (error instanceof Error) {
        errorDetails = `Name: ${error.name}, Message: ${error.message}`;
        // @ts-expect-error TS(2339) Property 'cause' does not exist on type 'Error'.
        if (error.cause) {
          try {
            // @ts-expect-error TS(2339) Property 'cause' does not exist on type 'Error'.
            errorDetails += ` | Cause: ${JSON.stringify(
              error.cause,
              Object.getOwnPropertyNames(error.cause)
            )}`;
          } catch (_stringifyError) {
            // Mark as unused if not needed
            // @ts-expect-error TS(2339) Property 'cause' does not exist on type 'Error'.
            errorDetails += ` | Cause: (Could not stringify - ${String(
              error.cause
            )})`;
          }
        }
      } else {
        errorDetails = `Error: ${String(error)}`;
      }

      console.error(
        "[remove-background route] Error al conectar con el backend:",
        error,
        "Formatted Details:",
        errorDetails
      );

      return NextResponse.json(
        {
          status: 500,
          message:
            "No se pudo conectar con el servicio de procesamiento de imágenes. Revise los logs del servidor frontend para más detalles.",
          errorDetails: errorDetails, // Added detailed error information
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
      const hostHeaderValue = req.headers.get("host") || "localhost:3000";
      const hostParts = hostHeaderValue.split(":");
      const hostnameFromHeader = hostParts[0].trim(); // Added trim
      const portFromHeader = hostParts.length > 1 ? hostParts[1].trim() : null; // Added trim

      let protocolForApiAccess: string;
      const xForwardedProtoHeader = req.headers.get("x-forwarded-proto") as
        | string
        | null;

      if (xForwardedProtoHeader) {
        protocolForApiAccess = xForwardedProtoHeader
          .split(",")[0]
          .trim()
          .toLowerCase();
      } else {
        try {
          const currentRequestURL = new URL(req.url);
          protocolForApiAccess = currentRequestURL.protocol
            .replace(":", "")
            .toLowerCase();
        } catch (e) {
          console.error(
            "Error parsing req.url to determine API access protocol:",
            e,
            "Defaulting to http."
          );
          protocolForApiAccess = "http";
        }
      }

      let protocolForImageServing = protocolForApiAccess;

      // Break down hostHeaderValue for robust comparison
      const hostPartsForComparison = hostHeaderValue.split(":");
      const hostnameFromHeaderForComparison = hostPartsForComparison[0];
      const portFromHeaderForComparison =
        hostPartsForComparison.length > 1 ? hostPartsForComparison[1] : null;

      // Pre-decision logging
      console.log("[URL Pre-Override Check]");
      console.log(`  hostHeaderValue: "${hostHeaderValue}"`);
      console.log(
        `  hostnameFromHeader: "${hostnameFromHeaderForComparison}" (lower: "${hostnameFromHeaderForComparison.toLowerCase()}")`
      );
      console.log(`  portFromHeader: "${portFromHeaderForComparison}"`);
      console.log(`  protocolForApiAccess: "${protocolForApiAccess}"`);

      // Check for the specific EC2 development host (case-insensitive hostname)
      const ec2DevHostnameTarget =
        "ec2-34-246-184-131.eu-west-1.compute.amazonaws.com";
      const ec2DevPortTarget = "3000";

      const isSpecificEC2DevHost =
        hostnameFromHeader.toLowerCase() === ec2DevHostnameTarget &&
        portFromHeader === ec2DevPortTarget;

      // Check for standard local development hosts
      const isStandardLocalDevHost =
        hostHeaderValue.startsWith("localhost:") ||
        hostHeaderValue.startsWith("127.0.0.1:");

      console.log("[URL Override Condition Check Values]");
      console.log(
        `  Comparing hostname: "${hostnameFromHeader.toLowerCase()}" === "${ec2DevHostnameTarget}" -> ${
          hostnameFromHeader.toLowerCase() === ec2DevHostnameTarget
        }`
      );
      console.log(
        `  Comparing port: "${portFromHeader}" === "${ec2DevPortTarget}" -> ${
          portFromHeader === ec2DevPortTarget
        }`
      );
      console.log(`  Result isSpecificEC2DevHost: ${isSpecificEC2DevHost}`);
      console.log(`  Result isStandardLocalDevHost: ${isStandardLocalDevHost}`);

      if (isSpecificEC2DevHost || isStandardLocalDevHost) {
        if (protocolForApiAccess === "https") {
          console.warn(
            `[URL Generation Override Triggered] API accessed via ${protocolForApiAccess} for host "${hostHeaderValue}". ` +
              `Image URL will use http as this host is assumed to serve images via HTTP only.`
          );
        }
        protocolForImageServing = "http";
      } else {
        console.log(
          "[URL Generation Override NOT Triggered] Conditions not met for specific dev host or local host."
        );
      }

      const localImageUrl = `${protocolForImageServing}://${hostHeaderValue}/images-output/${outputFileName}`;

      // Enhanced logging for debugging URL generation
      console.log("[URL Generation Details]");
      console.log(`  Incoming request URL (req.url): ${req.url}`);
      console.log(
        `  Host header (req.headers.get("host")): ${req.headers.get("host")}`
      );
      console.log(`  X-Forwarded-Proto header: ${xForwardedProtoHeader}`);
      console.log(
        `  Protocol used for API access (protocolForApiAccess): ${protocolForApiAccess}`
      );
      console.log(
        `  Protocol chosen for image serving (protocolForImageServing): ${protocolForImageServing}`
      );
      console.log(`  Final localImageUrl for client: ${localImageUrl}`);

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
        const host = req.headers.get("host") || "localhost:3000"; // This is the host of the Next.js frontend
        let protocol: string;

        const xForwardedProtoHeader = req.headers.get("x-forwarded-proto") as
          | string
          | null;
        if (xForwardedProtoHeader) {
          // If x-forwarded-proto is set (e.g., by a load balancer or reverse proxy), trust it.
          // It might be a comma-separated list if there are multiple proxies. Take the first one.
          protocol = xForwardedProtoHeader.split(",")[0].trim().toLowerCase();
        } else {
          // If no x-forwarded-proto, determine protocol from the request URL to this API route.
          // req.url in NextRequest is an absolute URL string.
          try {
            const currentRequestURL = new URL(req.url);
            protocol = currentRequestURL.protocol
              .replace(":", "")
              .toLowerCase(); // "http" or "https"
          } catch (e) {
            // Fallback in case req.url is unexpectedly not an absolute URL
            console.error(
              "Error parsing req.url to determine protocol:",
              e,
              "Defaulting to http."
            );
            protocol = "http"; // Safe fallback
          }
        }

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
