import { Router } from "express";
import {
  createDirectoryController,
  deleteDirectoryController,
  getAllDirectories,
  renameDirectoryController,
} from "../controllers/directory.controller.js";

const router = Router();

router.get("/all", getAllDirectories);
router.post("/create", createDirectoryController);
router.patch("/rename-directory", renameDirectoryController);
router.delete("/delete-directory", deleteDirectoryController);

export default router;
