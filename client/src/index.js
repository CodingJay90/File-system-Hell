import "./styles/styles.scss";
import axios from "axios";
import uid from "shortid";
import {
  BackdropWithSpinner,
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
  //   console.log(folder);
  folder.child.forEach((i) => {
    i.id = uid();
    renderComponent(
      FolderBlock({ folder_name: i.name, id: i.id, level: "level-0" }),
      `${folder.id}`
    );
    console.log(i.child);
    if (i.child) checkForSubFolders(i);
  });
}

async function appInit(event) {
  try {
    renderComponent(BackdropWithSpinner(), "app");
    const { data } = await http.get("/directories");
    let allDirectories = [];
    data.directories.forEach(async (i, index) => {
      i.id = uid();
      const res = await http.get(`/files/?directory=${i.name}`);
      renderComponent(
        FolderBlock({ folder_name: i.name, id: i.id }),
        "folder-container"
      );
      if (res.data?.files) i.files = res.data.files;
      if (i.child) checkForSubFolders(i);
    });
    console.log(data);
  } catch (error) {
    console.log("err");
  }
}
// unmountComponent("loading-spinner");

window.addEventListener("load", appInit);
