import { getCurrentLocation, initMap } from './js/maps';
import './js/resizer.js';
import { refs } from './js/refs';
import {
  handleClickFindMeBtn,
  handleClickOnMap,
  handleClickRandomBtn,
  handleMarkerDragend,
} from './js/handlers.js';
import { initMarker, initSavedMarkers, userMarkers } from './js/marker.js';
// import { initInfoWindow } from './js/infoWindow.js';

export let obj = {};

let isAppInitialized = false;

async function initApp() {
  if (isAppInitialized) return;
  isAppInitialized = true;

  console.trace('Init App');
  const { map, marker, infoWindow } = await initMap(await getCurrentLocation());
  obj = { map, marker, infoWindow };

  // initSavedMarkers();

  refs.randomBtn.addEventListener('click', handleClickRandomBtn);

  refs.findMeBtn.addEventListener('click', handleClickFindMeBtn);

  // refs.addMarkerBtn.addEventListener('click', async () => {
  //   initMarker(await getCurrentLocation(), true, 'Added marker');
  // });

  // map.addListener('click', event => {
  //   handleClickOnMap(event, userMarkers);
  // });
}

initApp();
