import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { removeBackgroundController } from "../controllers/remove-background.controller";

const router = express.Router();

// Asegura que la carpeta uploads exista y usa ruta absoluta
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("[INFO] Carpeta 'uploads' creada en:", uploadDir);
}
const upload = multer({ dest: uploadDir });

// Middleware de logging para depuración
router.post(
  "/",
  (req, res, next) => {
    console.log("[DEBUG] Content-Type:", req.headers["content-type"]);
    next();
  },
  upload.single("image"),
  removeBackgroundController
);

export default router;
