import fs from "fs";
import path from "path";
import ErrorResponse from "../utils/errorResponse.js";

export function getDir(filePath) {
  let resolvedPath = path.resolve(filePath);
  return resolvedPath;
}

export function readFileContent(fileDir) {
  let buffer = fs.readFileSync(fileDir);
  let data = JSON.parse(buffer);
  return data;
}

export function readAllDir(dir) {
  let filenames = fs.readdirSync(dir, { withFileTypes: true });
  return filenames;
}

export function moveFile(from, to) {
  const source = fs.createReadStream(from);
  const destination = fs.createWriteStream(to);

  return new Promise((resolve, reject) => {
    source.on("end", resolve);
    source.on("error", reject);
    source.pipe(destination);
  });
}

export function deleteFileFromDirectory(dir) {
  try {
    checkFileExists(dir);
    fs.rmdirSync(dir, { recursive: true });
    return true;
  } catch (error) {
    throw error;
  }
}

export function renameFile(oldFileName, newFileName) {
  try {
    checkFileExists(oldFileName);
    fs.renameSync(oldFileName, newFileName);
    return true;
  } catch (error) {
    throw error;
  }
}

export function checkFileExists(fileDir) {
  try {
    fs.accessSync(fileDir, fs.constants.F_OK);
    return true;
  } catch (error) {
    throw new ErrorResponse("File doesn't exist", 401);
  }
}
