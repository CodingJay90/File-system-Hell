/**
 * @swagger
 * components:
 *   schemas:
 *    File:
 *       type: object
 *       properties:
 *         file_dir:
 *           type: string
 *           description: directory where the file resides.
 *           example: C:\\Users\\HP\\Documents\\NODEJS PROJECTS\\File system\\myFiles\\allDocs
 *         file_name:
 *           type: string
 *           description: Name of the file.
 *           example: example.json
 *         file_ext:
 *           type: string
 *           description: File extension name.
 *           example: .json
 *         file_content:
 *           type: string
 *           description: Content of the file.
 *           example: <h1>Hello world in a html file</h1>
 */
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
/**
 * @swagger
 * /addresses:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: Retrieve all addresses belonging to the authorised user.
 *     responses:
 *       200:
 *         description: List of addresses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized.
 */
router.get("/get-file", getFile);
router.post("/create-file", createFileController);
router.post("/move-file", moveFileController);
router.patch("/rename-file", renameFileController);
router.delete("/delete-file", deleteFileController);

export default router;
