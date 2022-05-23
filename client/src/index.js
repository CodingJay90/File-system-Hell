import "./styles/styles.scss";
import uid from "shortid";
import {
  BackdropWithSpinner,
  DropDownContext,
  FileBlock,
  FolderBlock,
  renderComponent,
  TextField,
  TextFieldErrorMessage,
  unmountComponent,
} from "./components";
import { deleteDomElement, selectDomElement } from "./utils";
import DnD from "./DragNDrop";
import { http } from "./api";

let workspaceName = "Work space";
let currentFolderTarget = null;
let folderPathKeys = {};
let files = {};
let rootFolder = "myFiles";
let fileOrFolder = "";
let rootDirPathname = null;
let dnd = new DnD(folderPathKeys, files);

async function onTextFieldChange(e) {
  try {
    let value = e.target.value;
    let fileName = value.includes(".") ? value.split(".")[0] : value;
    let extName = value.includes(".")
      ? value.split(".")[value.split(".").length - 1]
      : ""; //check for extension name
    let selectedFolder =
      folderPathKeys[currentFolderTarget]?.path.split("\\") ||
      rootDirPathname.split("\\"); //add to root dir if no folder is selected
    let index = selectedFolder.indexOf(rootFolder);
    let newFilePath =
      selectedFolder.slice(index + 1).join("/") || rootDirPathname;
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
          new_directory: `${newFilePath}/${fileName.trim()}`,
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

function checkForSubFolders(folder) {
  folder.child.forEach(async (i) => {
    i.id = uid();
    renderComponent(
      FolderBlock({ folder_name: i.name, id: i.id, nested: "nested" }),
      `${folder.id}`
    );
    addEventListenersToFolders();
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
}

function checkForFilesInDirectories(folder) {
  folder.files?.forEach(async (i) => {
    i.file_id = uid();
    renderComponent(
      FileBlock({ name: i.file_name, id: i.file_id, file_id: i.file_id }),
      folder.id
    );
    addEventListenerToFiles();
    let res = await http.get("/files/get-file", {
      params: { directory: i.file_dir },
    });
    files[i.file_id] = { ...res.data, ...i };
  });
  collapseAllFolders();
}

async function handleFolderCreation() {
  try {
    renderComponent(BackdropWithSpinner(), "app");
    const { data } = await http.get("/directories");
    rootDirPathname = data.root_dir;

    data.directories.forEach(async (i, index) => {
      i.id = uid();
      folderPathKeys[i.id] = i;
      const res = await http.get(`/files/?directory=${i.name}`);
      renderComponent(
        FolderBlock({ folder_name: i.name, id: i.id }),
        "folder-container"
      );
      addEventListenersToFolders();
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

function addEventListenersToFolders() {
  const folders = document.querySelectorAll(".explorer__content-folder");
  folders.forEach((i) => {
    i.addEventListener("mousedown", onFolderClick);
    i.addEventListener("mouseenter", handleFolderHover);

    i.addEventListener("dragstart", dnd.drag);
    i.addEventListener("dragover", dnd.dragOver);
    i.addEventListener("drop", dnd.dragDrop);
    i.addEventListener("dragenter", dnd.dragEnter);
    i.addEventListener("dragleave", dnd.dragLeave);
    i.addEventListener("dragend", dnd.dragEnd);
  });
}

function addEventListenerToFiles() {
  const allFiles = document.querySelectorAll(".explorer__content-file");
  allFiles.forEach((i) => {
    i.addEventListener("mousedown", handleFileClick);

    i.addEventListener("dragstart", dnd.drag);
    i.addEventListener("dragover", dnd.dragOver);
    i.addEventListener("drop", dnd.dragDrop);
    i.addEventListener("dragenter", dnd.dragEnter);
    i.addEventListener("dragleave", dnd.dragLeave);
    i.addEventListener("dragend", dnd.dragEnd);
  });
}

function renameFolder(e) {
  e.stopPropagation();
}

function onFolderClick(e) {
  const { currentTarget } = e;
  e.stopPropagation();
  const folderId = currentTarget.dataset.folder_id;
  currentFolderTarget = folderId;
  if (e.button === 0) {
    const children = Array.from(currentTarget.children);
    const subFolders = children.filter((i) =>
      Array.from(i.classList).includes("nested")
    );
    const folderArrowIcon = document.querySelector(
      `[id='${folderId}'] i.fa-angle-right`
    );
    folderArrowIcon.classList.toggle("fa-rotate-90");
    e.currentTarget.classList.toggle("explorer__content-folder--collapsed");
    subFolders.forEach((i) => i.classList.toggle("d-none"));
  }
  if (e.button === 2) {
    let container = selectDomElement(`[id='${folderId}']`);
    container.insertAdjacentHTML("beforeend", DropDownContext());
    selectDomElement("#rename").addEventListener("click", renameFolder);
  }
}

function handleFolderHover(e) {
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
}

function handleFileClick(e) {
  e.stopPropagation();
  const fileId = e.currentTarget.dataset.file_id;
  console.log(fileId);
}

function addFileOrFolder(type) {
  fileOrFolder = type;
  if (!currentFolderTarget) {
    currentFolderTarget = "folder-container"; //update ui to add file or folder to root folder container
  }
  // console.log(currentFolderTarget);
  // console.log(rootDirPathname);
  // if (!currentFolderTarget && type === "file")
  //   return alert("Please select a folder to add a file to");
  const parentFolder = selectDomElement(
    `[id='${currentFolderTarget || "folder-container"}']`
  );
  const isFileInput = type === "file";
  parentFolder.insertAdjacentHTML("beforeend", TextField({ isFileInput }));
  const textField = selectDomElement("#textField__wrapper input");
  textField.focus();
  textField.addEventListener("keyup", onTextFieldChange);
}

function addGlobalEventListener() {
  let trashZone = selectDomElement("#trash__zone");
  const addFileBtn = selectDomElement("#add__file");
  const addFolderBtn = selectDomElement("#add__folder");

  addFileBtn.addEventListener("click", () => addFileOrFolder("file"));
  addFolderBtn.addEventListener("click", () => addFileOrFolder("folder"));

  trashZone.addEventListener("dragover", dnd.trashZoneDragOver);
  trashZone.addEventListener("drop", dnd.dropInTrash);
  trashZone.addEventListener("dragleave", () =>
    trashZone.classList.remove("delete__zone--over--dashed")
  );
}

function appInit(e) {
  try {
    e.preventDefault();
    handleFolderCreation();
    addGlobalEventListener();
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", appInit);
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
}); //0038481171
