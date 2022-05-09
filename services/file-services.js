import fs from "fs";

export function readFileContent(fileDir) {
  let bufferData = fs.readFileSync(fileDir);
  let stData = bufferData.toString();
  let data = JSON.parse(stData);
  return data;
}

export function readAllDir(dir) {
  let files = [];
  fs.readdir("./", (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      files.push(file);
    });
  });
  return files;
}
