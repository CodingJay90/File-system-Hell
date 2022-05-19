import { http } from "./api";
import {
  BackdropWithSpinner,
  renderComponent,
  unmountComponent,
} from "./components";
import { selectDomElement } from "./utils";

class DnD {
  constructor() {
    this.trashZone = null;
    this.selectedId = null;
    this.type = "";
    // this.drag = this.drag.bind(this);
    // this.dropInTrash = this.dropInTrash.bind(this);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods
      .filter((method) => method !== "constructor")
      .forEach((method) => {
        this[method] = this[method].bind(this);
      });
  }

  drag(e) {
    e.stopPropagation();
    const trashZone = document.getElementById("trash__zone");
    this.trashZone = trashZone;
    this.type = e.currentTarget.dataset.type;
    this.trashZone.classList.add("delete__zone--over");
    this.selectedId =
      e.currentTarget.dataset.folder_id || e.currentTarget.dataset.file_id;
    console.log(e.currentTarget.dataset);
  }

  dragLeave() {
    // console.log("Event: ", "dragleave");
  }

  dragOver(e) {
    // console.log("Event: ", "dragover");
    e.preventDefault();
  }

  dragDrop(e) {
    e.preventDefault();
  }

  dragEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    this.trashZone.classList.remove("delete__zone--over");
  }

  //trashZone
  trashZoneDragOver(e) {
    e.preventDefault();
    this.trashZone.classList.add("delete__zone--over--dashed");
  }

  dropInTrash(e, args) {
    let { folderPaths, filePaths } = args;
    e.stopPropagation();
    this.trashZone.classList.remove("delete__zone--over--dashed");
    console.log(filePaths);
    const path =
      this.type === "folder"
        ? folderPaths[this.selectedId].path
        : filePaths[this.selectedId].file_dir;
    this.deleteDirectoryApi(path);
    e.preventDefault();
  }

  async deleteDirectoryApi(path) {
    try {
      console.log(path);
      if (this.type === "folder")
        await http.delete("/directories/delete", { data: { directory: path } });
      if (this.type === "file")
        await http.delete("/files/delete", { data: { file_dir: path } });

      console.log(this.selectedId);
      console.log(document.getElementById(this.selectedId));
      unmountComponent(this.selectedId);
      this.trashZone.classList.remove("delete__zone--over");
    } catch (error) {
      alert("OOPS! an error occurred");
      unmountComponent("loading-spinner");
    }
  }
}

export default DnD;
