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
    // this.trashZone.addEventListener("dragover", (e) => {
    //   this.trashZone.classList.add("delete__zone--over--dashed");
    //   e.preventDefault();
    // });
    // this.trashZone.addEventListener("dragleave", () =>
    //   this.trashZone.classList.remove("delete__zone--over--dashed")
    // );
    // this.trashZone.addEventListener("drop", (e) => this.dropInTrash(e));
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
    // this.dropInTrash();
  }

  //trashZone
  trashZoneDragOver(e) {
    this.trashZone.classList.add("delete__zone--over--dashed");
    e.preventDefault();
  }

  dropInTrash(e, pathKeys) {
    e.stopPropagation();
    e.preventDefault();
    renderComponent(BackdropWithSpinner(), "app");
    this.trashZone.classList.remove("delete__zone--over--dashed");
    console.log(pathKeys);
    console.log(pathKeys[this.selectedId]);
    const path = pathKeys[this.selectedId].path;
    this.deleteDirectoryApi(path);
  }

  async deleteDirectoryApi(path) {
    try {
      await http.delete("/directories/delete", { data: { directory: path } });
      this.trashZone.classList.remove("delete__zone--over");
      unmountComponent("loading-spinner");
      unmountComponent(this.selectedId);
    } catch (error) {
      alert("OOPS! an error occurred");
      unmountComponent("loading-spinner");
    }
  }
}

export default DnD;
