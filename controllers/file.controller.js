import path from "path";
import { readFileContent } from "../services/file-services.js";

let baseDir = "./myFiles";
let baseDi2 = path.resolve(
  "__dirname",
  "../",
  "myFiles",
  "allDocs",
  "sample.json"
);

export async function getFile(req, res) {
  try {
    const fileDir = `${baseDi2}`;
    const file = readFileContent(fileDir);
    console.log(`${baseDir}/allDocs/sample.json`);

    res.json({ file_content: file, file_dir: fileDir, baseDi2 });
  } catch (error) {
    console.log(error);
  }
}

export async function getAllFiles(req, res) {
  try {
    const file = readFileContent(`${baseDir}/allDocs/sample.json`);
    res.json({ file_content: file });
  } catch (error) {
    console.log(error);
  }
}
