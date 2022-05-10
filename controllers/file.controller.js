import {
  deleteFileFromDirectory,
  getDir,
  moveFile,
  readAllDir,
  readFileContent,
} from "../services/file-services.js";
import path from "path";

let baseDir = "./myFiles";
export async function getFile(req, res) {
  try {
    const fileDir = getDir(`${baseDir}/allDocs/sample.json`);
    const file = readFileContent(fileDir);
    res.json({ file_content: file, file_dir: fileDir });
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
    res.json({ files: fileContent, file_dir: fileDir });
  } catch (error) {
    console.log(error);
  }
}

export async function moveFileController(req, res) {
  try {
    const oldPath = getDir(`${baseDir}/test.txt`);
    await moveFile(oldPath, getDir(`${baseDir}/acceptedDocs/test.txt`));
    deleteFileFromDirectory(oldPath);
    res.send("result");
  } catch (error) {
    console.log(error.message);
  }
}
