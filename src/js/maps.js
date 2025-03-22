const { Map } = await google.maps.importLibrary('maps');
const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
const { geometry } = await google.maps.importLibrary('geometry');

let map, infoWindow;

export async function initMap(position = { lat: -25.344, lng: 131.031 }) {
  map = await new Map(document.getElementById('map'), {
    zoom: 5,
    center: position,
    mapId: 'DEMO_MAP_ID',
  });

  const marker = initMarker(map, position, true, 'Draggable marker');

  infoWindow = new google.maps.InfoWindow();

  return { map, marker, infoWindow };
}

export async function getMyGeolocation() {
  try {
    const pos = await getCurrentLocation();

    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    infoWindow.open(map);
    map.setCenter(pos);
  } catch (error) {
    handleLocationError(true, infoWindow, map.getCenter());
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

export async function drawRoute(map, encodedPolyline) {
  const path = google.maps.geometry.encoding.decodePath(encodedPolyline);

  const routePath = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });

  routePath.setMap(map);
}

export function markerUpdate(marker, position) {
  marker.position = position;
}

export function getRandomPlace() {
  return {
    lat: Number(getRandomArbitrary(-85.05, 85.05)),
    lng: Number(getRandomArbitrary(-180, 180)),
  };
}

function initMarker(map, position, draggable, title) {
  return new AdvancedMarkerElement({
    map: map,
    position: position,
    gmpDraggable: draggable,
    title: title,
  });
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
