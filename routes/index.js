import { Router } from "express";
import { getAllFiles } from "../controllers/file.controller.js";
import fileRoutes from "./file.routes.js";
const router = Router();

router.use("/files", fileRoutes);

router.use((_, res, __) => {
  const error = new Error("API Endpoint Not found");

  res.status(404).json({
    message: error.message,
  });
});

export default router;
