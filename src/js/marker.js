// import { userMarkers } from '../main';
import { handleMarkerDragend } from './handlers';
import { getDataFromLS } from './localStorage';
import { obj } from '../main';

export let userMarkers = [];

export async function initMarker(
  map,
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
    map: map,
    position: position,
    gmpDraggable: draggable,
    gmpClickable: true,
    content: glyphSvgPinElement?.element,
    title,
  });

  marker.addListener('dragstart', () => {
    obj.infoWindow.close();
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
  obj.infoWindow.close();
  obj.infoWindow.setContent(markup);
  obj.infoWindow.open(marker.map, marker);
}

export function initSavedMarkers() {
  const savedMarkers = getDataFromLS('user-markers');
  if (!savedMarkers || savedMarkers.length === 0) return; // Avoid unnecessary processing

  userMarkers = savedMarkers;
  userMarkers.forEach(markerData => {
    initMarker(markerData, false, 'User saved marker');
  });
  console.log('Init SavedMarkers');
}
