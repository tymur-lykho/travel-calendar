import { refs } from './refs';

// const refs.resizer = document.querySelector('.resizer');
const leftColumn = refs.resizer.previousElementSibling;

let isResizing = false;

refs.resizer.addEventListener('mousedown', event => {
  isResizing = true;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(event) {
  if (!isResizing) return;

  let newLeftWidth = event.clientX - leftColumn.getBoundingClientRect().left;
  leftColumn.style.width = `${newLeftWidth}px`;
}

function onMouseUp() {
  isResizing = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
