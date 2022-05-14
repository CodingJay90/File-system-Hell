import "./styles/styles.scss";
import axios from "axios";
import uid from "shortid";
import {
  BackdropWithSpinner,
  FileBlock,
  FolderBlock,
  renderComponent,
  TextField,
  TextFieldErrorMessage,
  unmountComponent,
} from "./components";
import { selectDomElement } from "./utils";
const http = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 0,
  headers: {
    Accept: "application/vnd.GitHub.v3+json",
  },
});

let workspaceName = "Work space";
let currentFolderTarget = null;
let folderPathKeys = {};
let files = {};
let rootFolder = "myFiles";
let fileOrFolder = "";

async function onTextFieldChange(e) {
  try {
    let value = e.target.value;
    let fileName = value.includes(".") ? value.split(".")[0] : value;
    let extName = value.includes(".")
      ? value.split(".")[value.split(".").length - 1]
      : ""; //check for extension name
    let selectedFolder = folderPathKeys[currentFolderTarget].path.split("\\");
    let index = selectedFolder.indexOf(rootFolder);
    let newFilePath = selectedFolder.slice(index + 1).join("/");

    const textFieldContainer = selectDomElement("#textField__wrapper");
    unmountComponent("textFieldErrorBox");
    if (e.key === "Enter" || e.code === "Enter") {
      if (!value)
        return textFieldContainer.insertAdjacentHTML(
          "beforeend",
          TextFieldErrorMessage({
            message: "A file or folder name must be entered",
          })
        );
      if (fileOrFolder === "file") {
        await http.post("/files/create", {
          file_name: fileName,
          file_ext: `.${extName}`,
          output_dir: newFilePath,
          content: "",
        });
        renderComponent(
          FileBlock({ name: fileName, id: uid(), file_id: uid() }),
          currentFolderTarget
        );
      } else {
        let res = await http.post("/directories/create", {
          new_directory: `${newFilePath}/${fileName}`,
        });
        if (res.data.success === false) {
          textFieldContainer.insertAdjacentHTML(
            "beforeend",
            TextFieldErrorMessage({
              message: res.data.message,
            })
          );
          return;
        }
        renderComponent(
          FolderBlock({ folder_name: fileName, id: uid() }),
          currentFolderTarget
        );
      }
      unmountComponent("explorer__content-input");
    }

    if (e.key === "Escape" || e.code === "Escape")
      unmountComponent("explorer__content-input");
  } catch (error) {
    console.log(error);
    alert("error creating " + fileOrFolder);
  }
}

function b(folder) {}

function checkForSubFolders(folder) {
  folder.child.forEach(async (i) => {
    i.id = uid();
    renderComponent(
      FolderBlock({ folder_name: i.name, id: i.id, nested: "nested" }),
      `${folder.id}`
    );
    folderPathKeys[i.id] = i;
    let selectedFolder = i.path.split("\\");
    let pathIndex = selectedFolder.indexOf(rootFolder);
    let newFilePath = selectedFolder.slice(pathIndex + 1).join("/");
    const { data } = await http.get(`/files/?directory=${newFilePath}`);
    if (data.files.length) {
      i.files = data.files;
      checkForFilesInDirectories(i);
    }
    if (i.child) {
      checkForSubFolders(i);
    }
  });
  // if (i.child) {
  //   i.child.forEach(async (x) => {
  //     let selectedFolder = x.path.split("\\");
  //     let index = selectedFolder.indexOf(rootFolder);
  //     let newFilePath = selectedFolder.slice(index + 1).join("/");
  //     console.log(selectedFolder);
  //     x.id = uid();
  //   const { data } = await http.get(`/files/?directory=${newFilePath}`);
  //   if (data.files.length) {
  //     x.files = data.files;
  //     // console.log(x);
  //     checkForFilesInDirectories(x);
  //   }
  // });
  //   checkForSubFolders(i);
  // }
  // collapseAllFolders();
  // });
}

function checkForFilesInDirectories(folder) {
  console.log(folder);
  folder.files?.forEach(async (i) => {
    i.fileId = uid();
    renderComponent(
      FileBlock({ name: i.file_name, id: uid(), file_id: i.fileId }),
      folder.id
    );
    let res = await http.get("/files/get-file", {
      params: { directory: i.file_dir },
    });
    files[i.fileId] = { ...res.data, ...i };
  });
  collapseAllFolders();
}

async function handleFolderCreation() {
  try {
    renderComponent(BackdropWithSpinner(), "app");
    const { data } = await http.get("/directories");

    console.log(data.directories);
    data.directories.forEach(async (i, index) => {
      i.id = uid();
      folderPathKeys[i.id] = i;
      // console.log(i.name);
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
  console.log(e.button);
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
  subFolders.forEach((i) => i.classList.toggle("d-none"));
  currentFolderTarget = folderId;
};

window.handleFileClick = function handleFileClick(e) {
  const fileId = e.currentTarget.dataset.fileid;
  console.log(files[fileId]);
};

window.handleFolderHover = function handleFolderHover(e) {
  let addFileBtn = selectDomElement("#add__file");
  let addFolderBtn = selectDomElement("#add_folder");
  let workspaceNameContainer = selectDomElement(".file__name");
  let workSpaceNavBtnContainer = selectDomElement(
    ".explorer__content-headerNav ul"
  );
  workspaceNameContainer.textContent = `${workspaceName.substring(0, 5)}...`;
  workSpaceNavBtnContainer.classList.remove("d-none");
  // addFileBtn.addEventListener("click", () => addFileOrFolder("file"));
  // addFolderBtn.addEventListener("click", () => addFileOrFolder("folder"));
};

window.addFileOrFolder = function addFileOrFolder(type) {
  fileOrFolder = type;
  if (!currentFolderTarget && type === "file")
    return alert("Please select a folder to add a file to");
  const parentFolder = selectDomElement(
    `[id='${currentFolderTarget || "folder-container"}']`
  );
  const isFileInput = type === "file";
  parentFolder.insertAdjacentHTML("beforeend", TextField({ isFileInput }));
  const textField = selectDomElement("#textField__wrapper input");
  textField.focus();
  textField.addEventListener("keyup", onTextFieldChange);
};

window.addEventListener("load", appInit);
