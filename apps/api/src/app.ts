import express, { type Express } from "express";
import removeBackgroundRouter from "./routes/remove-background.route";
import { healthRouter } from "./routes/health.route";
import path from "path";
import cors from "cors";

export const createApp = (): Express => {
  const app = express();

  // Configurar CORS para permitir peticiones del frontend
  const allowedOrigins = [
    "http://localhost:3000", // For local development
    "http://ec2-34-246-184-131.eu-west-1.compute.amazonaws.com", // For EC2 frontend on default HTTP port
    // Add other origins if your frontend runs on a different port on EC2, e.g.:
    "http://ec2-34-246-184-131.eu-west-1.compute.amazonaws.com:3000", // Assuming frontend might run on 3000 on EC2
    "http://ec2-34-246-184-131.eu-west-1.compute.amazonaws.com:80", // Explicitly for port 80
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
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
  return app;
};
