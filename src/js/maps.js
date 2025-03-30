import { refs } from './refs';
import { getRandomArbitrary } from './utils';
import { handleClickOnMap, handleLocationError } from './handlers';
import { initMarker, initSavedMarkers, userMarkers } from './marker';

import { globals } from './globals';

export async function initMap(position = { lat: -25.344, lng: 131.031 }) {
  const { Map } = await google.maps.importLibrary('maps');

  const map = await new Map(refs.mapArea, {
    zoom: 16,
    center: position,
    mapId: 'DEMO_MAP_ID',
  });

  map.addListener('click', event => {
    handleClickOnMap(event, userMarkers);
  });

  console.log('Init Map');

  return map;
}

export async function getMyGeolocation() {
  try {
    const pos = await getCurrentLocation();

    globals.infoWindow.setPosition(pos);
    globals.infoWindow.setContent('Your current location');
    globals.infoWindow.open(globals.map);

    globals.map.setCenter(pos);
  } catch (error) {
    handleLocationError(true, globals.infoWindow, globals.map.getCenter());
  }
}

export async function getCurrentLocation() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position =>
        res({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      e => rej(e),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

export function getRandomPlace() {
  return {
    lat: Number(getRandomArbitrary(-64.05, 85.05)),
    lng: Number(getRandomArbitrary(-180, 180)),
  };
}
