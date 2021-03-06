import { http } from "./api";
import {
  BackdropWithSpinner,
  renderComponent,
  unmountComponent,
} from "./components";
import { selectDomElement } from "./utils";

class DnD {
  constructor(folders, files) {
    this.files = files;
    this.folders = folders;
    this.trashZone = null;
    this.selectedId = null;
    this.dropZoneId = null;
    this.type = "";
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods
      .filter((method) => method !== "constructor")
      .forEach((method) => {
        this[method] = this[method].bind(this);
      });
  }

  drag(e) {
    e.stopPropagation();
    console.log("dragging");
    const trashZone = document.getElementById("trash__zone");
    this.trashZone = trashZone;
    this.type = e.currentTarget.dataset.type;
    this.trashZone.classList.add("delete__zone--over");
    this.selectedId =
      e.currentTarget.dataset.folder_id || e.currentTarget.dataset.file_id;
    console.log("files", this.files);
    console.log("folders", this.folders);
  }

  dragLeave(e) {
    e.stopPropagation();
    // e.currentTarget.classList.remove("explorer__content-folder--over");
  }

  dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log("Event: ", "dragover");
    // e.currentTarget.classList.add("explorer__content-folder--over");
  }

  dragDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    let folderMoved = this.type === "folder";
    let currentTarget = e.currentTarget;
    let fileName;
    let oldDir;
    let newDir;
    if (currentTarget.classList.contains("explorer__content-file"))
      currentTarget = currentTarget.parentElement; //check if a file is dropped on a file rather than a folder and set the current target to it's nearest parent

    this.dropZoneId =
      currentTarget.dataset.folder_id || currentTarget.dataset.file_id;
    if (this.dropZoneId === this.selectedId) return; //prevent further execution if dragged item id in the same folder as the drop zone

    if (folderMoved) {
      oldDir = this.folders[this.selectedId].path; //source
      newDir = this.folders[this.dropZoneId].path; //target
      const newDirPathName = this.folders[this.selectedId].name;
      this.moveFileOrFolderAPI(oldDir, newDir, this.type);
      this.swap();
      this.folders[this.selectedId].path = `${newDir}\\${newDirPathName}`;
    } else {
      fileName = this.files[this.selectedId].file_name;
      oldDir = this.files[this.selectedId].file_dir;
      newDir = `${this.folders[this.dropZoneId].path}\\${fileName}`;

      this.moveFileOrFolderAPI(oldDir, newDir, this.type);
      this.swap();
      this.files[this.selectedId].file_dir = newDir; //update the new path for the newly moved file
    }
  }

  dragEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    this.trashZone.classList.remove("delete__zone--over");
  }

  swap() {
    let from = selectDomElement(`[id='${this.selectedId}']`);
    let to = selectDomElement(`[id='${this.dropZoneId}']`);
    from.classList.add("nested");

    if (from.contains(to)) return; //prevent parent folder getting moved into subfolder
    if (!to.classList.contains("explorer__content-folder--collapsed"))
      from.classList.add("d-none"); //add a display none style to moved element if parent element is collapsed
    if (to.classList.contains("explorer__content-file")) {
      from.classList.remove("d-none");
      to.parentElement.appendChild(from);
      return;
    }
    to.appendChild(from);
  }

  async moveFileOrFolderAPI(old_dir, new_dir, type) {
    try {
      if (type === "file") await http.post("/files/move", { old_dir, new_dir });
      if (type === "folder")
        await http.post("/directories/move", { old_dir, new_dir });
    } catch (error) {
      alert("OOPS, an error occurred");
    }
  }

  //trashZone
  trashZoneDragOver(e) {
    e.preventDefault();
    this.trashZone.classList.add("delete__zone--over--dashed");
  }

  dropInTrash(e) {
    e.stopPropagation();
    this.trashZone.classList.remove("delete__zone--over--dashed");
    const path =
      this.type === "folder"
        ? this.folders[this.selectedId].path
        : this.files[this.selectedId].file_dir;
    console.log(path);
    this.deleteDirectoryApi(path);
    e.preventDefault();
  }

  async deleteDirectoryApi(path) {
    try {
      //condition to determine if a file or folder is moved
      if (this.type === "folder")
        await http.delete("/directories/delete", { data: { directory: path } });
      if (this.type === "file")
        await http.delete("/files/delete", { data: { file_dir: path } });
      unmountComponent(this.selectedId);
      this.trashZone.classList.remove("delete__zone--over");
    } catch (error) {
      alert("OOPS! an error occurred");
      unmountComponent("loading-spinner");
    }
  }
}

export default DnD;
