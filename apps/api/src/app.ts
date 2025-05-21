import express, { type Express } from "express";
import removeBackgroundRouter from "./routes/remove-background.route";
import { healthRouter } from "./routes/health.route";
import processingStatusRouter from "./routes/processing-status.route";
import userRouter from "./routes/user.route";
import path from "path";
import cors from "cors";

export const createApp = (): Express => {
  const app = express(); // Configurar CORS para permitir peticiones del frontend
  // Usando una configuración simplificada con origen permitido para todos
  app.use(
    cors({
      origin: "*", // Permitir cualquier origen
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "Cache-Control",
        "Pragma",
      ],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  app.use(express.json());

  // Configurar directorio de imágenes procesadas como estático
  const outputDir = path.resolve(__dirname, "../images-output");
  app.use("/images-output", express.static(outputDir));
  app.use("/health", healthRouter);
  app.use("/remove-background", removeBackgroundRouter);
  app.use("/processing-status", processingStatusRouter);
  app.use("/user", userRouter);
  return app;
};
