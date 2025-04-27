import type { Request, Response } from "express";
import { removeBackgroundFromImage } from "../services/background-removal.service";

export const removeBackgroundController = async (
  req: Request,
  res: Response
) => {
  try {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res
        .status(400)
        .json({ error: "El campo imagePath es obligatorio" });
    }

    const result = await removeBackgroundFromImage(imagePath);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
