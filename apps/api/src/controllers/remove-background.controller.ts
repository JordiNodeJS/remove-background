import type { Request, Response, RequestHandler } from "express";
import { removeBackgroundFromImage } from "../services/background-removal.service";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../utilities/apiResponse";
import path from "path";
import fs from "fs";

export const removeBackgroundController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const outputDir = path.resolve(__dirname, "../../images-output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const file = req.file;
    console.log("Received file:", file?.filename); // Log para depuración
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

    // Procesa la imagen y obtiene el buffer
    const { fileBuffer } = await removeBackgroundFromImage(file);

    // Configura la cabecera Content-Type para image/png
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json(serverErrorResponse(error as Error));
  }
};
