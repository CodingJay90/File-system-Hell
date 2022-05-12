import "./styles/styles.scss";
import axios from "axios";
import uid from "shortid";
import {
  BackdropWithSpinner,
  FileBlock,
  FolderBlock,
  renderComponent,
  unmountComponent,
} from "./components";
const http = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 0,
  headers: {
    Accept: "application/vnd.GitHub.v3+json",
  },
});

function checkForSubFolders(folder) {
  folder.child.forEach((i) => {
    i.id = uid();
    renderComponent(
      FolderBlock({ folder_name: i.name, id: i.id, nested: "nested" }),
      `${folder.id}`
    );
    if (i.child) checkForSubFolders(i);
  });
}
function checkForFilesInDirectories(folder) {
  folder.files.forEach((i) => {
    renderComponent(FileBlock({ name: i.file_name, id: uid() }), folder.id);
  });
}

async function appInit(event) {
  try {
    // renderComponent(BackdropWithSpinner(), "app");
    const { data } = await http.get("/directories");
    data.directories.forEach(async (i, index) => {
      i.id = uid();
      const res = await http.get(`/files/?directory=${i.name}`);
      renderComponent(
        FolderBlock({ folder_name: i.name, id: i.id }),
        "folder-container"
      );
      if (res.data?.files?.length) {
        i.files = res.data.files;
        checkForFilesInDirectories(i);
      }
      if (i.child) checkForSubFolders(i);
    });
    console.log(data);
  } catch (error) {
    console.log("err");
  }
}
// unmountComponent("loading-spinner");

window.addEventListener("load", appInit);
