import { globals } from './globals';
import { handleMarkerDragend } from './handlers';
import { getDataFromLS } from './localStorage';

export let userMarkers = [];

export async function initMarker(
  position,
  draggable,
  title,
  markerImage = undefined
) {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    'marker'
  );

  let glyphSvgPinElement;
  if (markerImage) {
    const glyphImg = document.createElement('img');
    glyphImg.src = markerImage;

    glyphSvgPinElement = new PinElement({
      glyph: glyphImg,
    });
  }

  const marker = new AdvancedMarkerElement({
    map: globals.map,
    position: position,
    gmpDraggable: draggable,
    gmpClickable: true,
    content: glyphSvgPinElement?.element,
    title,
  });

  marker.addListener('dragstart', () => {
    globals.infoWindow.close();
  });

  marker.addListener('dragend', () => handleMarkerDragend(marker));

  marker.addListener('gmp-click', () => handleMarkerDragend(marker));

  console.log('Init Marker');

  return marker;
}

export function markerUpdate(marker, position) {
  marker.position = position;
}

export function redrawMarkerWindow(marker, markup) {
  globals.infoWindow.close();
  globals.infoWindow.setContent(markup);
  globals.infoWindow.open(marker.map, marker);
}

export function initSavedMarkers() {
  const savedMarkers = getDataFromLS('user-markers');
  savedMarkers.forEach(markerData => {
    initMarker(markerData, false, 'User saved marker');
  });
  console.log('Init SavedMarkers');
}
