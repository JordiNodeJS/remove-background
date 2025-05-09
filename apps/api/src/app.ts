import express, { type Express } from "express";
import removeBackgroundRouter from "./routes/remove-background.route";
import { healthRouter } from "./routes/health.route";
import path from "path";

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  // Configurar directorio de imágenes procesadas como estático
  const outputDir = path.resolve(__dirname, "../images-output");
  app.use("/images-output", express.static(outputDir));

  app.use("/health", healthRouter);
  app.use("/remove-background", removeBackgroundRouter);
  return app;
};
