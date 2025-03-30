import { refs } from './refs';
import { getRandomArbitrary } from './utils';
import { handleClickOnMap, handleLocationError } from './handlers';
import { initMarker, initSavedMarkers, userMarkers } from './marker';
import peopleIcon from '../img/emoji-people.svg';

import { obj } from '../main';

let isMapInitialized = false;

export async function initMap(position = { lat: -25.344, lng: 131.031 }) {
  const { Map, InfoWindow } = await google.maps.importLibrary('maps');

  const map = await new Map(refs.mapArea, {
    zoom: 16,
    center: position,
    mapId: 'DEMO_MAP_ID',
  });

  const marker = await initMarker(
    map,
    position,
    true,
    'Your location',
    peopleIcon
  );

  const infoWindow = new InfoWindow();

  initSavedMarkers();

  map.addListener('click', event => {
    handleClickOnMap(event, userMarkers);
  });

  console.log('Init Map');

  return { map, marker, infoWindow };
}

export async function getMyGeolocation() {
  try {
    const pos = await getCurrentLocation();

    obj.infoWindow.setPosition(pos);
    obj.infoWindow.setContent('Your current location');
    obj.infoWindow.open(map);

    obj.map.setCenter(pos);
  } catch (error) {
    handleLocationError(true, obj.infoWindow, map.getCenter());
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
