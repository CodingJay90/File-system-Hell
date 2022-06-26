import "./styles/styles.scss";
import uid from "shortid";
import {
  BackdropWithSpinner,
  DropDownContext,
  FileBlock,
  FolderBlock,
  renderComponent,
  renderIcon,
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
let currentElementTarget = null;

function getFile(query) {
  return http.get("/files/get-file", {
    params: { directory: query },
  });
}

function addFileAPI(body) {
  return http.post("/files/create", { ...body });
}

async function renameFolderAPI(body) {
  const res = await http.patch("/directories/rename", { ...body });
  return res.data;
}
async function renameFileAPI(body) {
  const res = await http.patch("/files/rename", { ...body });
  return res.data;
}

function deleteFile() {}

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
    let fileIcon = selectDomElement(
      `[id='${currentFolderTarget}'] .text__field-icon`
    );
    let fileExt = value.split(".").pop();
    fileIcon.innerHTML = renderIcon(`.${fileExt}`);
    if (e.key === "Enter" || e.code === "Enter") {
      if (!value)
        return textFieldContainer.insertAdjacentHTML(
          "beforeend",
          TextFieldErrorMessage({
            message: "A file or folder name must be entered",
          })
        );
      if (fileOrFolder === "file") {
        let fileId = uid();

        let newFile = {
          file_name: fileName,
          file_ext: `.${extName}`,
          output_dir: newFilePath,
          content: "",
        };
        await addFileAPI(newFile);
        files[fileId] = {
          file_content: "",
          file_id: fileId,
          file_name: fileName,
          file_type: extName,
          file_dir: newFilePath
            ? `${rootDirPathname}\\${newFilePath}\\${fileName}.${extName}`
            : `${rootDirPathname}\\${fileName}.${extName}`,
        };
        renderComponent(
          FileBlock({
            name: fileName,
            id: fileId,
            file_id: fileId,
            ext: `.${extName}`,
          }),
          currentFolderTarget
        );
      } else {
        let res = await http.post("/directories/create", {
          new_directory: `${newFilePath}\\${fileName.trim()}`,
        });
        let folderId = uid();
        let folderSplit = newFilePath.split("\\");
        let folderName = folderSplit[folderSplit.length - 1];
        let index = folderSplit.indexOf(rootFolder);

        if (index === -1)
          newFilePath = `${rootDirPathname}\\${newFilePath}\\${fileName.trim()}`;

        if (res.data.success === false) {
          textFieldContainer.insertAdjacentHTML(
            "beforeend",
            TextFieldErrorMessage({
              message: res.data.message,
            })
          );
          return;
        }
        folderPathKeys[folderId] = {
          child: [],
          id: folderId,
          name: folderName,
          path: `${newFilePath}`,
        };
        renderComponent(
          FolderBlock({
            folder_name: fileName,
            id: folderId,
            nested: "nested",
          }),
          currentFolderTarget
        );
      }
      unmountComponent("explorer__content-input");
      addEventListenersToFolders();
      addEventListenerToFiles();
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
    console.log(data);
    if (data.files?.length) {
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
      FileBlock({
        name: i.file_name,
        id: i.file_id,
        file_id: i.file_id,
        ext: i.file_type,
      }),
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

function collapseAllFolders() {
  const nestedBlocks = Array.from(document.querySelectorAll(".nested"));
  nestedBlocks.forEach((el) => el.classList.add("d-none"));
  unmountComponent("loading-spinner");
}

async function onRenameInputChange(e) {
  e.stopPropagation();
  const isFolder =
    selectDomElement(`[id='${currentFolderTarget}']`).dataset.type === "folder"; //check if we right clicked on a folder or file
  let defaultValue = e.target.defaultValue;
  let value = e.target.value;
  let textNode = document.createTextNode(value);
  let fileIcon = selectDomElement(
    `[id='${currentFolderTarget}'] .fileIcon__wrapper`
  );
  let fileExt = value.split(".").pop();
  if (!isFolder) fileIcon.innerHTML = renderIcon(`.${fileExt}`); //update file icon on tying
  try {
    if (e.key === "Enter" || e.code === "Enter") {
      if (isFolder) {
        await renameFolderAPI({
          old_file_path: folderPathKeys[currentFolderTarget].path,
          new_directory_name: value,
        });
      } else {
        await renameFileAPI({
          old_file_path: files[currentFolderTarget].file_dir,
          new_file_name: value,
        });
      }
      currentElementTarget.replaceChild(
        textNode,
        currentElementTarget.childNodes[0]
      );
    }
    if (e.key === "Escape" || e.code === "Escape") {
      textNode.nodeValue = defaultValue;
      if (!isFolder)
        fileIcon.innerHTML = renderIcon(`.${defaultValue.split(".").pop()}`); //reset the file extension and value to it's initial state
      currentElementTarget.replaceChild(
        textNode,
        currentElementTarget.childNodes[0]
      );
    }
  } catch (error) {
    // console.log(error.response);
    if (error.response.status === 400)
      return alert(error.response.data.message);
    alert("OOps an error occurred");
  }
}

function renameFolder(e) {
  e.stopPropagation();
  let target = selectDomElement(`[id='${currentFolderTarget}'] .name__wrapper`);
  currentElementTarget = target;
  let value = target.textContent;
  let inputNode = document.createElement("input");
  Object.assign(inputNode, {
    className: "rename__input",
    id: "rename__input",
    value,
    defaultValue: value,
    onkeyup: onRenameInputChange,
    autocomplete: "off",
    onmousedown: (ev) => ev.stopPropagation(),
  });
  target.replaceChild(inputNode, target.childNodes[0]);
  setTimeout(() => document.getElementById("rename__input").focus(), 0); //not sure why the setTimeout works on the function, but it did
  unmountComponent("dropdown__context");
}

async function deleteFileOrFolder(e) {
  e.preventDefault();
  e.stopPropagation();
  try {
    let target = selectDomElement(`[id='${currentFolderTarget}']`);
    let isFolder = target.dataset.type === "folder";
    if (isFolder) {
      let path = folderPathKeys[currentFolderTarget].path;
      await http.delete("/directories/delete", { data: { directory: path } });
    } else {
      let path = files[currentFolderTarget].file_dir;
      await http.delete("/files/delete", { data: { file_dir: path } });
    }
    unmountComponent(currentFolderTarget);
  } catch (error) {
    console.log(error);
    alert("An error occurred");
  }
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

function addEventListenerToContextDropdown() {
  let deleteBtn = selectDomElement("#delete");
  let renameBtn = selectDomElement("#rename");

  deleteBtn.addEventListener("mousedown", deleteFileOrFolder);
  renameBtn.addEventListener("mousedown", renameFolder);
}

function showDropDownContext(id) {
  unmountComponent("dropdown__context");
  let container = selectDomElement(`[id='${id}']`);
  container.insertAdjacentHTML("beforeend", DropDownContext());
  addEventListenerToContextDropdown();
}

function onFolderClick(e) {
  e.stopPropagation();
  // e.preventDefault();
  const { currentTarget } = e;
  // e.cancelBubble = true;
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
  if (e.button === 2) showDropDownContext(folderId);
  return false;
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
  currentFolderTarget = fileId;
  if (selectDomElement("#explorer__content-input"))
    unmountComponent("explorer__content-input");
  console.log("file click");
  if (e.button === 0) {
    //left click
    console.log(fileId);
  }
  if (e.button === 2) showDropDownContext(fileId);
}

function addFileOrFolder(type) {
  fileOrFolder = type;
  if (!currentFolderTarget) {
    currentFolderTarget = "folder-container"; //update ui to add file or folder to root folder container
  }
  const parentFolder = selectDomElement(
    `[id='${currentFolderTarget || "folder-container"}']`
  );
  const isFileInput = type === "file";
  if (selectDomElement("#explorer__content-input"))
    unmountComponent("explorer__content-input");
  parentFolder.insertAdjacentHTML("beforeend", TextField({ isFileInput }));
  const textField = selectDomElement("#textField__wrapper input");
  textField.focus();
  textField.addEventListener("keyup", onTextFieldChange);
}

function refreshFolders(e) {
  const container = selectDomElement("#folder-container");
  //remove all folders before refreshing
  do {
    container.removeChild(container.firstChild);
  } while (container.firstChild);
  appInit(e);
}

function addGlobalEventListener() {
  const addFileBtn = selectDomElement("#add__file");
  const addFolderBtn = selectDomElement("#add__folder");
  const collapseFoldersBtn = selectDomElement("#collapse__folders");
  const refreshFolderBtn = selectDomElement("#refresh__folders");
  const explorerContainer = selectDomElement(".explorer__content");
  let trashZone = selectDomElement("#trash__zone");

  // explorerContainer.addEventListener("mousedown", (e) => {
  //   console.log("event from parent fired", e.target.classList);
  //   if (e.target.classList.contains("explorer__content"))
  //     currentFolderTarget = "folder-container";
  // });
  addFileBtn.addEventListener("click", () => addFileOrFolder("file"));
  addFolderBtn.addEventListener("click", () => addFileOrFolder("folder"));
  refreshFolderBtn.addEventListener("click", refreshFolders);
  collapseFoldersBtn.addEventListener("click", () => {
    let el = Array.from(
      document.querySelectorAll(".explorer__content-folder--collapsed")
    );
    let arrowIcons = Array.from(
      document.querySelectorAll(".explorer__content-folder--collapsed i")
    );
    el.forEach((i) =>
      i.classList.remove("explorer__content-folder--collapsed")
    );
    arrowIcons.forEach((i) => i.classList.remove("fa-rotate-90"));
    collapseAllFolders();
  });
  trashZone.addEventListener("dragover", dnd.trashZoneDragOver);
  trashZone.addEventListener("drop", dnd.dropInTrash);
  trashZone.addEventListener("dragleave", () =>
    trashZone.classList.remove("delete__zone--over--dashed")
  );
}

async function handleFolderCreation() {
  try {
    renderComponent(BackdropWithSpinner(), "app");
    const { data } = await http.get("/directories");
    rootDirPathname = data.root_dir;
    console.log(data.directories);

    data.directories?.forEach(async (i, index) => {
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

function appInit(e) {
  try {
    e.preventDefault();
    handleFolderCreation();
    addGlobalEventListener();
  } catch (error) {
    console.log(error);
  } finally {
    collapseAllFolders();
  }
}

window.addEventListener("load", appInit);
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
let obj = {
  content: [
    { text: "paragraph 1" },
    {
      content: [{ text: "paragraph 2" }],
    },
    { text: "paragraph 3" },
    {
      content: [
        { text: "paragraph 4" },
        {
          content: [{ text: "paragraph 5" }],
        },
      ],
    },
  ],
};
