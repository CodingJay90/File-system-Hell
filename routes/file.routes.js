import { Router } from "express";
import {
  getAllFiles,
  getFile,
  moveFileController,
} from "../controllers/file.controller.js";
const router = Router();

router.get("/all", getAllFiles);
router.get("/get-file", getFile);
router.post("/move-file", moveFileController);

export default router;
