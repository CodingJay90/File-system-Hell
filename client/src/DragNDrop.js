class DnD {
  constructor(element) {
    this.element = element;
    this.trashZone = null;
    this.id = null;
  }

  drag(event) {
    const trashZone = document.getElementById("trash__zone");
    this.trashZone = trashZone;
    trashZone.classList.add("delete__zone--over");
    console.log("dragging");
    console.log(trashZone);
  }

  dragLeave() {
    console.log("Event: ", "dragleave");
  }

  dragOver(e) {
    console.log("Event: ", "dragover");
    e.preventDefault();
  }

  dragDrop() {
    console.log("Event: ", "drop");
  }

  dragEnd() {
    this.trashZone.classList.remove("delete__zone--over");
  }
}

export default DnD;
