const draggableItems = document.querySelectorAll('.draggable');
const draggableAreas = document.querySelectorAll('.draggable-container');

draggableItems.forEach(draggableItem => {
  draggableItem.addEventListener('dragstart', () => {
    draggableItem.classList.add('dragging');
  });

  draggableItem.addEventListener('dragend', () => {
    draggableItem.classList.remove('dragging');
  });
});

draggableAreas.forEach(draggableArea => {
  draggableArea.addEventListener('dragover', event => {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');

    const dropTarget = getDropPosition(draggableArea, event.clientY);

    if (dropTarget) {
      draggableArea.insertBefore(dragging, dropTarget);
    } else {
      draggableArea.appendChild(dragging);
    }
  });
});

function getDropPosition(container, yPos) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)'),
  ];

  for (const draggable of draggableElements) {
    const pos = draggable.getBoundingClientRect();
    if (yPos < pos.bottom) {
      return draggable;
    }
  }
  return null;
}
