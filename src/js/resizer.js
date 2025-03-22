const resizer = document.querySelector('.resizer');
const leftColumn = resizer.previousElementSibling;
const rightColumn = resizer.nextElementSibling;

let isResizing = false;

resizer.addEventListener('mousedown', event => {
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
