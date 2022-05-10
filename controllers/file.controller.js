import {
  deleteFileFromDirectory,
  getDir,
  moveFile,
  readAllDir,
  readFileContent,
  renameFile,
} from "../services/file-services.js";
import path from "path";
import ErrorResponse from "../utils/errorResponse.js";

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
    const fileDir = getDir(`${baseDir}/allDocs`);
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
    console.log(error);
  }
}

export async function moveFileController(req, res) {
  try {
    const oldPath = getDir(`${baseDir}/test.txt`);
    await moveFile(oldPath, getDir(`${baseDir}/acceptedDocs/test.txt`));
    deleteFileFromDirectory(oldPath);
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
