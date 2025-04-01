import { globals } from './globals';
import { handleMarkerDragend } from './handlers';
import { getDataFromLS, saveToLS } from './localStorage';

export let userMarkers = [];

export async function initMarker(
  position,
  draggable,
  title,
  markerImage = undefined,
  defaultMarker = true
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

  if (!!defaultMarker) {
    marker.addListener('dragend', () => handleMarkerDragend(marker));

    marker.addListener('gmp-click', () => handleMarkerDragend(marker));
  }
  console.log('Init Marker');

  return marker;
}

export function markerUpdate(marker, position) {
  marker.position = position;
}

export function updateMarkerWindow(marker, content, showLoader = false) {
  const loaderHTML = '<div class="loader"></div>';
  const finalContent = showLoader ? loaderHTML : content;

  globals.infoWindow.setContent(finalContent);
  globals.infoWindow.open(globals.map, marker);
}

export function initSavedMarkers() {
  userMarkers = getDataFromLS('user-markers');
  if (userMarkers) {
    userMarkers.forEach(markerData => {
      initMarker(markerData, true, 'User saved marker');
    });
  }
  const userLocation = getDataFromLS('user-location-marker');
  if (userLocation) {
    globals.marker.position = userLocation;
  }
  console.log('Init SavedMarkers');
}

export function addUserMarker(pos) {
  initMarker(pos, true, 'New User Marker');
  if (!userMarkers) {
    userMarkers = [pos];
  } else {
    userMarkers.push(pos);
  }
  saveToLS('user-markers', userMarkers);
}
