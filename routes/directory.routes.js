import { Router } from "express";
import {
  createDirectoryController,
  getAllDirectories,
} from "../controllers/directory.controller.js";

const router = Router();

router.get("/all", getAllDirectories);
router.post("/create", createDirectoryController);

export default router;
