import { saveToLS } from './localStorage';
import { getCurrentLocation, getMyGeolocation, getRandomPlace } from './maps';
import { initMarker, markerUpdate, redrawMarkerWindow } from './marker';
import { drawRoute, getRoutes } from './routes';
import { convertS } from './utils';

import { obj } from '../main';

export function handleClickRandomBtn() {
  const newPosition = getRandomPlace();
  obj.map.setCenter(newPosition);
  // initMarker(position, false, 'Random marker');
  markerUpdate(obj.marker, newPosition);
}

export async function handleClickFindMeBtn() {
  await getMyGeolocation();
  obj.map.setZoom(15);
}

export function handleLocationError(browserHasGeolocation, pos) {
  obj.infoWindow.setPosition(pos);
  obj.infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  obj.infoWindow.open(obj.map);
}

export async function handleMarkerDragend(marker) {
  const position = marker.position;
  let info = `<p>Pin dropped at: ${position.lat}, ${position.lng}</p>`;
  let encodedPolyline = null;
  redrawMarkerWindow(marker, '<div class="loader"></div>');
  try {
    const originCoordinate = await getCurrentLocation();
    const data = await getRoutes(originCoordinate, position);
    if (!data.routes || data.routes.length === 0) {
      info += '<b>No routes found</b>';
      redrawMarkerWindow(marker, info);
    } else {
      const route = data.routes[0];
      const routeDistance =
        route.distanceMeters > 1000
          ? route.distanceMeters / 1000
          : route.distanceMeters;
      const { days, hours, minutes } = convertS(
        Number.parseInt(route.duration)
      );
      encodedPolyline = route.polyline?.encodedPolyline || null;
      info += `<p>Approximate route length: ${routeDistance} ${
        routeDistance > 1000 ? 'km' : 'm'
      }</p>
  			<p>Approximate route time: ${days} d., ${hours} h., ${minutes} min. </p>`;
      if (encodedPolyline) {
        info += `<button id="btn-draw-route" type="button">Draw route</button>`;
      } else {
        info += '<b>No route polyline found</b>';
      }
    }
    redrawMarkerWindow(marker, info);
    google.maps.event.addListenerOnce(obj.infoWindow, 'domready', () => {
      const btn = document.getElementById('btn-draw-route');
      if (btn) {
        btn.addEventListener('click', () => {
          if (encodedPolyline) {
            drawRoute(encodedPolyline);
          } else {
            console.error('Cannot draw route: No encoded polyline available.');
          }
        });
      }
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    info += '<b>Error retrieving route data</b>';
    await getMyGeolocation();
    redrawMarkerWindow(marker, info);
  }
}

export async function handleClickOnMap(event, userMarkers) {
  const position = event.latLng;
  initMarker(position, true, 'New User Marker');
  userMarkers.push(position);
  saveToLS('user-markers', userMarkers);
}
