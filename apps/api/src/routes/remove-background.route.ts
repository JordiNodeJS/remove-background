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

// Configuración de multer para conservar la extensión original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

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
