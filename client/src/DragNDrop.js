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
    this.trashZone.classList.add("delete__zone--over");
    this.selectedId = e.currentTarget.dataset.folder_id;
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
    console.log("ended");
    // console.log(this.trashZone);
    this.trashZone.classList.remove("delete__zone--over");
  }

  //trashZone
  trashZoneDragOver(e) {
    e.preventDefault();
    this.trashZone.classList.add("delete__zone--over--dashed");
    console.log("dragging");
  }

  dropInTrash(e, pathKeys) {
    e.stopPropagation();
    console.log("deleted");
    this.trashZone.classList.remove("delete__zone--over--dashed");
    const path = pathKeys[this.selectedId].path;
    this.deleteDirectoryApi(path);
    e.preventDefault();
  }

  async deleteDirectoryApi(path) {
    try {
      await http.delete("/directories/delete", { data: { directory: path } });
      unmountComponent(this.selectedId);
      this.trashZone.classList.remove("delete__zone--over");
    } catch (error) {
      alert("OOPS! an error occurred");
      unmountComponent("loading-spinner");
    }
  }
}

export default DnD;
