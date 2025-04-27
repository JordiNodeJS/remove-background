import express, { type Express } from "express";
import removeBackgroundRouter from "./routes/remove-background.route";

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use("/remove-background", removeBackgroundRouter);
  return app;
};
