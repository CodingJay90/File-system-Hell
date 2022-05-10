import {
  createDirectory,
  listDirectories,
  readAllDirectory,
} from "../services/directory-services.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { baseDirectory } from "../utils/constants.js";
import { handleError } from "../utils/errorResponse.js";

export async function getAllDirectories(req, res) {
  try {
    // const directories = readAllDirectory(baseDirectory);
    const directories = await listDirectories(baseDirectory);
    //await listDirectories(path.resolve(baseDirectory))
    // listDirectories(baseDirectory);
    res.status(200).json({ directories });
  } catch (error) {
    handleError(error, res);
  }
}

export async function createDirectoryController(req, res) {
  try {
    let dir = path.resolve(baseDirectory, req.body.new_directory);
    createDirectory(dir);
    res.status(201).json("ok");
  } catch (error) {
    handleError(error, res);
  }
}
