import { Router } from "express";
import {
  deleteFileController,
  getAllFiles,
  getFile,
  moveFileController,
  renameFileController,
} from "../controllers/file.controller.js";

const router = Router();

router.get("/all", getAllFiles);
router.get("/get-file", getFile);
router.post("/move-file", moveFileController);
router.patch("/rename-file", renameFileController);
router.delete("/delete-file", deleteFileController);

export default router;
