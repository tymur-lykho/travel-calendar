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
    handleClickOnMap(event);
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
  try {
    const { data } = await axios(url);
    if (data.results && data.results.length !== 0) {
      return data.results;
    } else {
      throw new Error('Place not found!');
    }
  } catch (error) {
    iziToast.error({
      title: 'Get location error!',
      position: 'topRight',
      message: error,
    });
  }
}

export function getRandomPlace() {
  return {
    lat: Number(getRandomArbitrary(-64.05, 85.05)),
    lng: Number(getRandomArbitrary(-180, 180)),
  };
}

export function showPointOnMap(coordinates, pointData = {}) {
  globals.map.setCenter(coordinates);
  globals.infoWindow.setPosition(coordinates);
  if (pointData.length) {
    globals.infoWindow.setContent(pointData.title);
  } else {
    globals.infoWindow.setContent(
      `Poin coordinates: LAT:${coordinates.lat}, LNG: ${coordinates.lng}`
    );
  }
  globals.infoWindow.open(globals.map);
}
