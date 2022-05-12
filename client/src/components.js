import { selectDomElement } from "./utils";

export const FolderBlock = (props) => {
  console.log(props.level);
  let className = props.level
    ? `'explorer__content-folder ${props.level}'`
    : `explorer__content-folder`;

  return `<div class=${className} id=${props.id}>
      <div class="explorer__content-folder-group">
        <div class="explorer__content-folder-arrow">
          <i class="fa-solid fa-angle-right"></i>
        </div>
        <div class="explorer__content-folder-icon">
          <i class="fa-solid fa-folder-closed"></i>
        </div>
        <div class="explorer__content-folder-name">
          <span>${props.folder_name}</span>
        </div>
      </div>
    </div>
    `;
  //   selectDomElement(props.element).innerHtml += template;
};

export const FileBlock = () => {
  return `
    <div class="explorer__content-file level-0">
      <div class="explorer__content-file-group">
        <div class="explorer__content-folder-arrow"></div>
        <div class="explorer__content-folder-icon">
          <i class="fa-brands fa-js"></i>
        </div>
        <div class="explorer__content-folder-name">
          <span>index.js</span>
        </div>
      </div>
    </div>
    `;
  //   selectDomElement(props.element).innerHtml += template;
};
export const BackdropWithSpinner = (props) => {
  return `
  <style>
    .loading-overlay {
        display: none;
        background: rgba(255, 255, 255, 0.7);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9998;
        align-items: center;
        justify-content: center;
        }

        .loading-overlay.is-active {
        display: flex;
        }

        .code {
        font-family: monospace;
        /*   font-size: .9em; */
        color: #dd4a68;
        background-color: rgb(238, 238, 238);
        padding: 0 3px;
    } 
  </style>
    <div class="loading-overlay is-active" id="loading-spinner">
        <span class="fas fa-spinner fa-3x fa-spin"></span>
    </div>
    `;
};

export const renderComponent = (component, element) => {
  selectDomElement(element).innerHTML += component;
};

export const unmountComponent = (componentId) => {
  const el = document.getElementById(componentId);
  el?.remove();
};
