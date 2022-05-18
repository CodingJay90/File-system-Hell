class DnD {
  constructor(element) {
    this.element = element;
    this.trashZone = null;
    this.id = null;
    // this.drag = this.drag.bind(this);
    // this.dropInTrash = this.dropInTrash.bind(this);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods
      .filter((method) => method !== "constructor")
      .forEach((method) => {
        this[method] = this[method].bind(this);
      });
  }

  drag() {
    const trashZone = document.getElementById("trash__zone");
    this.trashZone = trashZone;
    this.trashZone.classList.add("delete__zone--over");
    console.log("first", this.dropInTrash);
    trashZone.addEventListener("dragover", (e) => e.preventDefault());
    trashZone.addEventListener("drop", this.dropInTrash);
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

  dropInTrash(e) {
    // this.trashZone.classList.remove("delete__zone--over");
    console.log("dropped");
    e.preventDefault();
  }
}

export default DnD;
