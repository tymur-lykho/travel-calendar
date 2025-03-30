import { refs } from './refs';
import { getRandomArbitrary } from './utils';
import { handleClickOnMap, handleLocationError } from './handlers';
import { userMarkers } from './marker';
import { config } from './config';

import { globals } from './globals';
import axios from 'axios';

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
    const currentPosition = await getCurrentLocation();

    globals.infoWindow.setPosition(currentPosition);
    globals.infoWindow.setContent('Your current location');
    globals.infoWindow.open(globals.map);
    globals.marker.position = currentPosition;
    globals.map.setCenter(currentPosition);
    globals.map.setZoom(15);
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

export async function getLocation(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${config.GM_API_KEY}`;

  const { data } = await axios(url);
  return data.results;
}

export function getRandomPlace() {
  return {
    lat: Number(getRandomArbitrary(-64.05, 85.05)),
    lng: Number(getRandomArbitrary(-180, 180)),
  };
}
