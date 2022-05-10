import { readAllDirectory } from "../services/directory-services.js";
import { fileURLToPath } from "url";
import path from "path";
import { baseDirectory } from "../utils/constants.js";

export async function getAllDirectories(req, res) {
  try {
    const directories = readAllDirectory(path.resolve(baseDirectory));
    res.status(200).json({ directories });
  } catch (error) {
    console.log(error);
  }
}
