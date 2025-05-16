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
  res.status(429).json({
    status: 429,
    message: "Este endpoint solo está disponible mediante la cola de procesamiento. Usa /remove-background/link para gestionar la espera.",
  });
};
