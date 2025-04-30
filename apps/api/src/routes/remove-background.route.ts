/**
 * Express router for handling background removal operations.
 * Sets up file upload handling with multer and defines POST endpoint.
 *
 * Features:
 * - Creates uploads directory if it doesn't exist
 * - Configures multer storage with unique filenames
 * - Includes debug logging middleware
 * - Handles single image file uploads
 *
 * @module RemoveBackgroundRoute
 * @requires express
 * @requires multer
 * @requires fs
 * @requires path
 * @requires removeBackgroundController
 *
 * @exports {Router} Express router configured for background removal operations
 */
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
/**
 * Multer disk storage configuration for handling file uploads.
 * Specifies the destination directory and generates unique filenames.
 *
 * @param {Object} destination - Callback configuration for upload destination
 * @param {Function} destination.cb - Callback that sets upload directory to `uploadDir`
 * @param {Object} filename - Callback configuration for filename generation
 * @param {Function} filename.cb - Callback that generates unique filename using timestamp and random number
 * @returns {multer.StorageEngine} Configured storage engine for multer
 */
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
