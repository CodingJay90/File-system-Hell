import { selectDomElement } from "./utils";

export const FolderBlock = (props) => {
  let className = props.nested
    ? `'explorer__content-folder ${props.nested}'`
    : `explorer__content-folder`;

  return `<div class=${className} id=${props.id} data-folderId=${props.id} onclick="onFolderClick(event)" onmouseenter="handleFolderHover(event)">
      <div class="explorer__content-folder-group">
        <div class="explorer__content-folder-arrow">
            <span>
                <i class="fa-solid fa-angle-right"></i>
            </span>
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
};

export const FileBlock = (props) => {
  const { name, id, file_id } = props;
  return `
    <div class="explorer__content-file nested" id=${id} data-fileId=${file_id} onclick="handleFileClick(event)">
      <div class="explorer__content-file-group">
        <div class="explorer__content-folder-arrow"></div>
        <div class="explorer__content-folder-icon">
          <i class="fa-brands fa-js"></i>
        </div>
        <div class="explorer__content-folder-name">
          <span>${name}</span>
        </div>
      </div>
    </div>
    `;
};

export const TextField = (props) => {
  const textFieldIcon = props.isFileInput
    ? `<i class="fa-solid fa-file-lines"></i>`
    : `<i class="fa-solid fa-folder-closed"></i>`;

  return `
    <div class="explorer__content-input" id="explorer__content-input" >
      <div class="explorer__content-input-group">
        <div class="explorer__content-input-icon">
          ${textFieldIcon}
        </div>
          <div class="explorer__content-input-textField" id="textField__wrapper">
            <input type="text" name="name" />
          </div>
        </div>
    </div>
  `;
};

export const TextFieldErrorMessage = (props) => {
  return `<div class="explorer__content-textField-error" id="textFieldErrorBox">
      <span>${props.message}</span>
    </div>`;
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
  document.getElementById(element).innerHTML += component;
};

export const unmountComponent = (componentId) => {
  const el = document.getElementById(componentId);
  el?.remove();
};
