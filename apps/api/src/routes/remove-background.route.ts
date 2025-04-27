import express from "express";
import multer from "multer";
import { removeBackgroundController } from "../controllers/remove-background.controller";

const router = express.Router();
const upload = multer(); // Configuración básica, almacenamiento en memoria

router.post("/", upload.single("image"), removeBackgroundController);

export default router;
