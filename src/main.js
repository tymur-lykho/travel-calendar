import { getCurrentLocation, initMap } from './js/maps';
import './js/resizer.js';
import { refs } from './js/refs';
import { handleClickFindMeBtn, handleClickRandomBtn } from './js/handlers.js';

export let obj = {};

async function initApp() {
  console.log('Init App');
  const currentPosition = await getCurrentLocation();
  const obj = await initMap(currentPosition);

  refs.randomBtn.addEventListener('click', handleClickRandomBtn);

  refs.findMeBtn.addEventListener('click', handleClickFindMeBtn);

  // refs.addMarkerBtn.addEventListener('click', async () => {
  //   initMarker(await getCurrentLocation(), true, 'Added marker');
  // });

  // map.addListener('click', event => {
  //   handleClickOnMap(event, userMarkers);
  // });
}

window.onload = initApp;
