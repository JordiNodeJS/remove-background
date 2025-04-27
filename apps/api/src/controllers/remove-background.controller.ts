import type { Request, Response, RequestHandler } from "express";
import { removeBackgroundFromImage } from "../services/background-removal.service";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../utilities/apiResponse";

export const removeBackgroundController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;
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

    // Aquí se asume que removeBackgroundFromImage acepta un buffer o path temporal
    const result = await removeBackgroundFromImage(file.path);
    res
      .status(200)
      .json(successResponse(result, "Fondo eliminado exitosamente"));
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json(serverErrorResponse(error as Error));
  }
};
