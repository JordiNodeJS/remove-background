import { Router } from "express";

const router = Router();

router.get("/remove-background", (req, res) => {
  res.status(200).json({ message: "ruta remove-background funcionando" });
});

export default router;
