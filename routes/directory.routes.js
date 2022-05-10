import { Router } from "express";
import { getAllDirectories } from "../controllers/directory.controller.js";

const router = Router();

router.get("/all", getAllDirectories);

export default router;
