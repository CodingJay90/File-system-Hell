import {
  createFile,
  deleteFileFromDirectory,
  getDir,
  moveFile,
  readAllDir,
  readFileContent,
  renameFile,
} from "../services/file-services.js";
import path from "path";
import ErrorResponse from "../utils/errorResponse.js";
import {
  checkDirectoryExists,
  createDirectory,
} from "../services/directory-services.js";

import { baseDirectory, __dirname } from "../utils/constants.js";
let baseDir = "./myFiles";

export async function getFile(req, res) {
  try {
    const fileDir = getDir(`${baseDir}/allDocs/sample.json`);
    const file = readFileContent(fileDir);
    res.status(200).json({ file_content: file, file_dir: fileDir });
  } catch (error) {
    console.log(error);
  }
}

export async function getAllFiles(req, res) {
  try {
    const fileDir = getDir(`${baseDir}/${req.query.directory}`);
    if (!checkDirectoryExists(fileDir))
      throw new ErrorResponse("No such directory", 401);
    const files = readAllDir(fileDir);

    const fileContent = [];
    files.forEach((i) => {
      fileContent.push({
        file_name: i.name,
        file_ext: path.extname(`${fileDir}/${i.name}`),
        content: readFileContent(`${fileDir}/${i.name}`),
      });
    });
    res.status(200).json({ files: fileContent, file_dir: fileDir });
  } catch (error) {
    let statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ success: false, message: error.message, code: statusCode });
  }
}

export async function createFileController(req, res) {
  try {
    const { output_dir, file_name, file_ext, content } = req.body;
    let OUTPUT_DIR = path.resolve(baseDirectory, output_dir);
    let OUTPUT_PATH = path.join(OUTPUT_DIR, `${file_name}${file_ext}`);
    if (!checkDirectoryExists(OUTPUT_DIR)) createDirectory(OUTPUT_DIR); //if the directory doesn't exist, create new

    let data = createFile(OUTPUT_PATH, content);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      code: error.statusCode || 500,
    });
  }
}

export async function moveFileController(req, res) {
  try {
    const { old_dir, new_dir } = req.body;
    // const oldPath = getDir(`${baseDir}/test.txt`);

    await moveFile(old_dir, new_dir);
    deleteFileFromDirectory(old_dir);
    res.status(201).json({ status: "success" });
  } catch (error) {
    console.log(error.message);
  }
}

export async function renameFileController(req, res) {
  try {
    let oldFile = req.body.oldFilePath;
    let extName = path.extname(oldFile);
    let oldFileName = path.basename(oldFile);
    let newFileName = req.body.newFileName + extName;
    let newFile = oldFile.replace(oldFileName, newFileName);
    if (oldFileName === newFileName)
      throw new ErrorResponse(
        "Old file name cannot be the same as new file name",
        400
      );
    if (renameFile(oldFile, newFile)) return res.status(204).json("ok");
  } catch (error) {
    res
      .status(error.statusCode)
      .json({ success: false, message: error.message, code: error.statusCode });
  }
}

export async function deleteFileController(req, res) {
  try {
    deleteFileFromDirectory(req.body.fileDir);
    res.status(204).json("ok");
  } catch (error) {
    res
      .status(error.statusCode)
      .json({ success: false, message: error.message, code: error.statusCode });
  }
}
