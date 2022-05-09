import { Router } from "express";
import { getAllFiles, getFile } from "../controllers/file.controller.js";
const router = Router();

router.get("/all", getAllFiles);
router.get("/get-file", getFile);

export default router;
