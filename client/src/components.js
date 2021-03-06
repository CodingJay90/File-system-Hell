import { selectDomElement } from "./utils";
import js from "./assets/fileIcons/js/js1.svg";
import ts from "./assets/fileIcons/js/ts.svg";
import json from "./assets/fileIcons/json/json.svg";
import css from "./assets/fileIcons/css/css.svg";
import postcss from "./assets/fileIcons/css/postcss.svg";
import scss from "./assets/fileIcons/css/scss-dark.svg";
import react from "./assets/fileIcons/js/react.svg";
import webpack from "./assets/fileIcons/js/webpack.svg";
import html from "./assets/fileIcons/html/html.svg";
import txt from "./assets/fileIcons/html/txt.svg";
import git from "./assets/fileIcons/git/git.svg";
import cc from "./assets/fileIcons/c/c.svg";
import cHash from "./assets/fileIcons/c/c++.svg";
import xml from "./assets/fileIcons/html/xml-file.svg";
import csv from "./assets/fileIcons/html/csv.svg";
import defaultFileIcon from "./assets/fileIcons/default/default-grey.svg";
import python from "./assets/fileIcons/python/python.svg";
import php from "./assets/fileIcons/php/php.svg";
import sql from "./assets/fileIcons/sql/sql.svg";
import rLang from "./assets/fileIcons/others/r.svg";
import ruby from "./assets/fileIcons/others/ruby.svg";
import swift from "./assets/fileIcons/others/swift.svg";
import java from "./assets/fileIcons/others/java.svg";
import julia from "./assets/fileIcons/others/julia.svg";
import ocaml from "./assets/fileIcons/others/ocaml.svg";
import go from "./assets/fileIcons/others/go.svg";
import coffee from "./assets/fileIcons/others/coffee.svg";
import clojure from "./assets/fileIcons/others/clojure.svg";
import docker from "./assets/fileIcons/others/docker.svg";
import jest from "./assets/fileIcons/others/jest.svg";
import test from "./assets/fileIcons/others/test.svg";
import mocha from "./assets/fileIcons/others/mocha.svg";
import hbs from "./assets/fileIcons/templates/handlebars.svg";
import next from "./assets/fileIcons/templates/nextjs.svg";
import nuxt from "./assets/fileIcons/templates/nuxt.svg";
import vue from "./assets/fileIcons/templates/vue.svg";

export function renderIcon(icon) {
  switch (icon) {
    case ".json":
    case ".jsonp":
      return `<object type="image/svg+xml" data=${json}></object>`;
    case ".js":
      return `<object type="image/svg+xml" data=${js}></object>`;
    case ".ts":
      return `<object type="image/svg+xml" data=${ts}></object>`;
    case ".vue":
      return `<object type="image/svg+xml" data=${vue}></object>`;
    case ".nuxt":
      return `<object type="image/svg+xml" data=${nuxt}></object>`;
    case ".next":
      return `<object type="image/svg+xml" data=${next}></object>`;
    case ".css":
      return `<object type="image/svg+xml" data=${css}></object>`;
    case ".scss":
      return `<object type="image/svg+xml" data=${scss}></object>`;
    case ".postcss":
      return `<object type="image/svg+xml" data=${postcss}></object>`;
    case ".html":
      return `<object type="image/svg+xml" data=${html}></object>`;
    case ".txt":
      return `<object type="image/svg+xml" data=${txt}></object>`;
    case ".cc":
      return `<object type="image/svg+xml" data=${cc}></object>`;
    case ".c":
      return `<object type="image/svg+xml" data=${cHash}></object>`;
    case ".xml":
      return `<object type="image/svg+xml" data=${xml}></object>`;
    case ".csv":
      return `<object type="image/svg+xml" data=${csv}></object>`;
    case ".py":
      return `<object type="image/svg+xml" data=${python}></object>`;
    case ".php":
      return `<object type="image/svg+xml" data=${php}></object>`;
    case ".sql":
      return `<object type="image/svg+xml" data=${sql}></object>`;
    case ".r":
      return `<object type="image/svg+xml" data=${rLang}></object>`;
    case ".rb":
      return `<object type="image/svg+xml" data=${ruby}></object>`;
    case ".swift":
      return `<object type="image/svg+xml" data=${swift}></object>`;
    case ".java":
      return `<object type="image/svg+xml" data=${java}></object>`;
    case ".ocaml":
      return `<object type="image/svg+xml" data=${ocaml}></object>`;
    case ".go":
      return `<object type="image/svg+xml" data=${go}></object>`;
    case ".coffee":
      return `<object type="image/svg+xml" data=${coffee}></object>`;
    case ".clj":
      return `<object type="image/svg+xml" data=${clojure}></object>`;
    case ".julia":
      return `<object type="image/svg+xml" data=${julia}></object>`;
    case ".jest":
      return `<object type="image/svg+xml" data=${jest}></object>`;
    case ".mocha":
      return `<object type="image/svg+xml" data=${mocha}></object>`;
    case ".test":
      return `<object type="image/svg+xml" data=${test}></object>`;
    case ".docker":
      return `<object type="image/svg+xml" data=${docker}></object>`;
    case ".jsx":
    case ".tsx":
      return `<object type="image/svg+xml" data=${react}></object>`;
    case ".git":
    case ".gitignore":
      return `<object type="image/svg+xml" data=${git}></object>`;
    case ".hbs":
    case ".handlebars":
    case ".mustache":
      return `<object type="image/svg+xml" data=${hbs}></object>`;
    case ".webpack":
    case ".webpack.config":
    case ".webpack.config.js":
    case ".webpack.config.ts":
      return `<object type="image/svg+xml" data=${webpack}></object>`;
      break;
    default:
      return `<object type="image/svg+xml" data=${defaultFileIcon}></object>`;
      break;
  }
}

export const FolderBlock = (props) => {
  let className = props.nested
    ? `'explorer__content-folder ${props.nested}'`
    : `explorer__content-folder`;

  return `<div draggable="true" class=${className} id=${props.id} data-type="folder" data-folder_id=${props.id}>
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
          <span class="name__wrapper">${props.folder_name}</span>
        </div>
      </div>
    </div>
    `;
};

function t() {
  return `<h1>hhs</h1>`;
}

export const FileBlock = (props) => {
  const { name, id, file_id, ext } = props;
  return `
    <div draggable="true" class="explorer__content-file nested" data-type="file" id=${id} data-file_id=${file_id}>
      <div class="explorer__content-file-group">
        <div class="explorer__content-folder-arrow"></div>
        <div class="explorer__content-folder-icon">
          <span class="fileIcon__wrapper">
            ${renderIcon(ext)}
          </span>
        </div>
        <div class="explorer__content-folder-name">
          <span class="name__wrapper">${name}</span>
        </div>
      </div>
    </div>
    `;
};

export const TextField = (props) => {
  const textFieldIcon = props.isFileInput
    ? `<object type="image/svg+xml" data=${defaultFileIcon}></object>`
    : `<i class="fa-solid fa-folder-closed"></i>`;

  return `
    <div class="explorer__content-input" id="explorer__content-input" >
      <div class="explorer__content-input-group">
        <div class="explorer__content-input-icon">
        <span class="text__field-icon">
          ${textFieldIcon}
        </span>
        </div>
          <div class="explorer__content-input-textField" id="textField__wrapper">
            <input type="text" name="name" autocomplete="off"/>
          </div>
        </div>
    </div>
  `;
};

export const DropDownContext = () => {
  return `<div class="context" id="dropdown__context">
            <div class="context__container">
              <ul>
                <li id="add__file-context">
                  <span>Add file</span>
                </li>
                <li id="add__folder-context">
                  <span>Add folder</span>
                </li>
                <li id="rename">
                  <span>Rename</span>
                </li>
                <li id="delete">
                  <span>Delete</span>
                </li>
                <li id="copy">
                  <span>Copy</span>
                </li>
                <li id="paste">
                  <span>Paste</span>
                </li>
              </ul>
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
