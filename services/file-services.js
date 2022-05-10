import fs from "fs";
import path from "path";

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
    if (!checkFileExists(dir)) return new Error("File doesn't exist" + dir);
    fs.rmdirSync(dir, { recursive: true });
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
    return false;
  }
}

export function renameFile(oldFileName, newFileName) {
  fs.renameSync(oldFileName, newFileName, (err) => {
    if (err) return false;
    return true;
  });
}
