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
    console.log("Received file:", file); // Log para depuración
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

    const outputPath = path.join(
      outputDir,
      `output-${path.basename(file.path)}`
    );

    // Pasa el objeto file completo al servicio
    const result = await removeBackgroundFromImage(file);
    res
      .status(200)
      .json(successResponse(result, "Fondo eliminado exitosamente"));
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json(serverErrorResponse(error as Error));
  }
};
