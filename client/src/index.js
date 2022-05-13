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
    collapseAllFolders();
  });
}

function checkForFilesInDirectories(folder) {
  folder.files.forEach((i) => {
    renderComponent(FileBlock({ name: i.file_name, id: uid() }), folder.id);
  });
}

async function handleFolderCreation() {
  try {
    renderComponent(BackdropWithSpinner(), "app");
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
  } catch (error) {
    throw error;
  }
}

function collapseAllFolders() {
  const nestedBlocks = Array.from(document.querySelectorAll(".nested"));
  nestedBlocks.forEach((el) => el.classList.add("d-none"));
  unmountComponent("loading-spinner");
}

async function appInit() {
  try {
    handleFolderCreation();
  } catch (error) {
    console.log("err");
  }
}

window.onFolderClick = function onFolderClick(e) {
  const { currentTarget } = e;
  e.preventDefault();
  e.stopPropagation();
  const children = Array.from(currentTarget.children);
  const folderId = currentTarget.dataset.folderid;
  const subFolders = children.filter((i) =>
    Array.from(i.classList).includes("nested")
  );
  const folderArrowIcon = document.querySelector(
    `[id='${folderId}'] i.fa-angle-right`
  );
  folderArrowIcon.classList.toggle("fa-rotate-90");
  e.currentTarget.classList.toggle("explorer__content-folder--collapsed");
  subFolders.forEach((i) => i.classList.toggle("d-block"));
  // if (currentTarget.classList.contains("explorer__content-folder--collapsed")) {
  //   subFolders.forEach((i) => i.classList.add("d-block"));
  // } else {
  //   subFolders.forEach((i) => i.classList.remove("d-block"));
  // }
};

window.addEventListener("load", appInit);
