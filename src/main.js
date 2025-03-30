import { getCurrentLocation, initMap } from './js/maps';
import './js/resizer.js';
import { refs } from './js/refs';
import {
  handleClickFindMeBtn,
  handleClickRandomBtn,
  handleMyMarkerDragend,
  handleSubmitLocationForm,
  handleClickOnFindLocation,
} from './js/handlers.js';
import { globals } from './js/globals';
import peopleIcon from './img/emoji-people.svg';
import { initInfoWindow } from './js/infoWindow';
import { initMarker, initSavedMarkers, userMarkers } from './js/marker';

async function initApp() {
  console.log('Init App');

  const currentPosition = await getCurrentLocation();

  globals.map = await initMap(currentPosition);
  globals.marker = await initMarker(
    currentPosition,
    true,
    'Your location',
    peopleIcon,
    false
  );
  globals.infoWindow = await initInfoWindow();

  initSavedMarkers();

  globals.marker.addListener('dragend', handleMyMarkerDragend);
  globals.marker.addListener('gmp-click', handleMyMarkerDragend);

  refs.randomBtn.addEventListener('click', handleClickRandomBtn);
  refs.findMeBtn.addEventListener('click', handleClickFindMeBtn);

  refs.addLocationForm.addEventListener('submit', handleSubmitLocationForm);
  refs.locationList.addEventListener('click', handleClickOnFindLocation);
}

window.onload = initApp;
