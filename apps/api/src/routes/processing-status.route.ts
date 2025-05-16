import express from "express";
import { imageProcessingQueue } from "../controllers/image-processing-queue";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ processing: imageProcessingQueue["processing"] });
});

export default router;
