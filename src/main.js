import {
  initMap,
  getRandomPlace,
  markerUpdate,
  getMyGeolocation,
  getCurrentLocation,
  drawRoute,
  redrawMarkerWindow,
} from './js/maps';
import './js/resizer.js';
import { getRoutes } from './js/routes.js';
import { convertS } from './js/utils.js';

const randomBtn = document.getElementById('btn-random-place');
const findMeBtn = document.getElementById('btn-my-coordinate');
// const getRoutesToPoint = document.getElementById('btn-get-routes-to-point');

const { map, marker, infoWindow } = await initMap();

randomBtn.addEventListener('click', async () => {
  const newPosition = await getRandomPlace();
  map.setCenter(newPosition);
  markerUpdate(marker, newPosition);
});

findMeBtn.addEventListener('click', async () => {
  await getMyGeolocation();
  map.setZoom(15);
});

// getRoutesToPoint.addEventListener('click', async () => {
//   try {
//     const originCoordinate = await getCurrentLocation();
//     const destinationCoordinate = marker.position;
//     getRoutes(originCoordinate, destinationCoordinate);
//   } catch (error) {
//     console.log(error);
//   }
// });

marker.addListener('dragstart', () => {
  infoWindow.close();
});

marker.addListener('dragend', async () => {
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

    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      const btn = document.getElementById('btn-draw-route');
      if (btn) {
        btn.addEventListener('click', () => {
          if (encodedPolyline) {
            drawRoute(map, encodedPolyline);
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
});
