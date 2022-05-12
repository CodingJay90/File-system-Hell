export const deleteDomElement = (element) => {
  const el = document.querySelector(element);
  el?.remove();
};

export const selectDomElement = (element) => document.querySelector(element);

export function showLoadingSpinner(text = "Loading...") {
  const template = `<div class="loading">
        <svg width="205" height="250" viewBox="0 0 40 50">
            <polygon stroke="#fff" strokeWidth="1" fill="none" points="20,1 40,40 1,40" />
            <text fill="#fff" x="5" y="47">${text}</text>
        </svg>
    </div>`;
  document.querySelector("body").insertAdjacentHTML("beforeend", template);
}
