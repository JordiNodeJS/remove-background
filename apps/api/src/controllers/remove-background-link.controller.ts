import type { Request, Response, RequestHandler } from "express";
import { removeBackgroundFromImage } from "../services/background-removal.service";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../utilities/apiResponse";
import path from "path";
import fs from "fs";

/**
 * Controlador para eliminar el fondo de una imagen y devolver la URL donde se puede consultar
 * @param req Solicitud HTTP con el archivo de imagen
 * @param res Respuesta HTTP con la URL de la imagen procesada
 */
export const removeBackgroundLinkController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const outputDir = path.resolve(__dirname, "../../images-output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const file = req.file;
    console.log("Received file for link generation:", file?.filename); // Log para depuración
    if (!file) {
      res
        .status(400)
        .json(
          errorResponse(
            400,
            "La imagen es obligatoria y debe enviarse como archivo (campo 'image')."
          )
        );
      return;
    }

    // Procesa la imagen y obtiene la ruta de salida
    const { outputPath } = await removeBackgroundFromImage(file);
    
    // Obtener el nombre del archivo de la ruta completa
    const fileName = path.basename(outputPath);
    
    // Construir la URL absoluta para acceder a la imagen
    // Obtenemos el protocolo (http/https) y el host (dominio) de la solicitud
    const protocol = req.protocol;
    const hostname = req.hostname; // Obtiene el nombre de host sin el puerto (ej. 'ec2-...')
    const apiPort = process.env.PORT || "3001"; // Puerto donde corre la API

    // Construir la URL base de la API asegurando el puerto correcto
    // Priorizar la variable de entorno APP_BASE_URL si está definida
    const appBaseUrlFromEnv = process.env.APP_BASE_URL;
    console.log(`[DEBUG] Valor de APP_BASE_URL desde .env: ${appBaseUrlFromEnv}`); // Registro para depuración

    let apiBaseUrl = appBaseUrlFromEnv;
    if (!apiBaseUrl) {
      console.warn("La variable de entorno APP_BASE_URL no está definida. Se recomienda configurarla para entornos de producción. Usando fallback basado en la solicitud.");
      apiBaseUrl = `${protocol}://${hostname}:${apiPort}`;
    } else {
      // Asegurarse de que la URL de APP_BASE_URL no tenga una barra al final
      if (apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
      }
    }
    const imageUrl = `${apiBaseUrl}/images-output/${fileName}`;
    
    // Devolver la URL en formato JSON
    res.status(200).json(
      successResponse(
        { url: imageUrl },
        "Imagen procesada correctamente. Utilice la URL proporcionada para acceder a la imagen sin fondo."
      )
    );
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json(serverErrorResponse(error as Error));
  }
};