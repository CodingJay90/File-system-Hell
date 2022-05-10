import { Router } from "express";
import {
  createFileController,
  deleteFileController,
  getAllFiles,
  getFile,
  moveFileController,
  renameFileController,
} from "../controllers/file.controller.js";

const router = Router();

router.get("/all", getAllFiles);
router.get("/get-file", getFile);
router.post("/create-file", createFileController);
router.post("/move-file", moveFileController);
router.patch("/rename-file", renameFileController);
router.delete("/delete-file", deleteFileController);

export default router;
