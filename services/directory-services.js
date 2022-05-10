import fs from "fs";
import path from "path";
import { baseDirectory } from "../utils/constants.js";

export function readAllDirectory(source) {
  try {
    return fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dir) => dir.isDirectory())
      .map((dir) => ({
        name: dir.name,
        path: path.resolve(baseDirectory, dir.name),
      }));
  } catch (error) {
    throw error;
  }
}

export function createDirectory(dir) {
  try {
    if (!checkDirectoryExists(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (error) {
    throw error;
  }
}

// returns true if the directory exist
export function checkDirectoryExists(dir) {
  try {
    if (fs.existsSync(dir)) return true;
    return false;
  } catch (error) {
    throw error;
  }
}
