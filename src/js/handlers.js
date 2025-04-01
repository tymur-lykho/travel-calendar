import { getDataFromLS, saveToLS } from './localStorage';
import {
  getCurrentLocation,
  getLocation,
  getMyGeolocation,
  getRandomPlace,
  showPointOnMap,
} from './maps';
import { initMarker, markerUpdate, updateMarkerWindow } from './marker';
import {
  createRoute,
  deleteUserRoute,
  drawRoute,
  getPointData,
  getRoutes,
  userRoutes,
} from './routes';
import { convertMetersToKmeters, convertS } from './utils';
import { globals } from './globals';
import randomIcon from '../img/random-marker.svg';
import findPlaceIcon from '../img/travel-explore.svg';
import { renderFindLocation, renderUserRoutes } from './render';
import { refs } from './refs';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let randomMarker;
let findLocationMarker;

export async function handleClickRandomBtn() {
  const newPosition = getRandomPlace();
  globals.map.setCenter(newPosition);

  if (!randomMarker) {
    randomMarker = await initMarker(
      newPosition,
      false,
      'Random marker',
      randomIcon
    );
  }

  markerUpdate(randomMarker, newPosition);
}

export async function handleClickFindMeBtn() {
  await getMyGeolocation();
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

  updateMarkerWindow(marker, '', true);

  try {
    const originCoordinate = globals.marker.position;
    const data = await getRoutes(originCoordinate, position);

    if (!data.routes || data.routes.length === 0) {
      info += '<b>No routes found</b>';
    } else {
      const route = data.routes[0];
      const { kkms, kms, meters } = convertMetersToKmeters(
        route.distanceMeters
      );
      const { days, hours, minutes } = convertS(
        Number.parseInt(route.duration)
      );
      encodedPolyline = route.polyline?.encodedPolyline || null;

      info += `<p>Approximate route length: ${kkms || ''} ${
        kms || ''
      } km., ${meters} meters</p>
  			<p>Approximate route time:
        ${days ? days + ' d.,' : ''}
        ${hours ? hours + ' h.,' : ''}
        ${minutes} min. </p>`;

      if (encodedPolyline) {
        info += `<button id="btn-draw-route" type="button">Draw route</button>`;
      } else {
        info += '<b>No route polyline found</b>';
      }
    }

    updateMarkerWindow(marker, info);

    google.maps.event.addListenerOnce(globals.infoWindow, 'domready', () => {
      const drawRouteBtn = document.getElementById('btn-draw-route');
      const addToRouteBtn = document.getElementById('btn-add-to-route');
      if (drawRouteBtn & createRouteBtn & addToRouteBtn) {
        drawRouteBtn.addEventListener('click', () => {
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
    updateMarkerWindow(marker, info);
  }
}

export async function handleClickOnMap(event, userMarkers) {
  const position = event.latLng;
  initMarker(position, true, 'New User Marker');
  userMarkers.push(position);
  saveToLS('user-markers', userMarkers);
}

export function handleMyMarkerDragend() {
  const position = globals.marker.position;
  updateMarkerWindow(globals.marker, '', true);
  saveToLS('user-location-marker', position);
  updateMarkerWindow(globals.marker, 'New your current location. Saved!');
}

export async function handleSubmitLocationForm(event) {
  event.preventDefault();
  const form = event.target;
  const query = form.elements['location-text'].value.trim();
  try {
    if (query) {
      const data = await getLocation(query);
      if (data) {
        renderFindLocation(data);
        refs.closeLocationListBtn.removeAttribute('hidden');
      }
    } else {
      throw new Error('Query Error');
    }
  } catch (error) {
    iziToast.error({
      title: 'Submit form error',
      position: 'topRight',
      message: error,
    });
  }
  form.elements['location-text'].value = '';
}

export async function handleClickOnFindLocation(event) {
  const item = event.target.closest('.location-item');
  if (item) {
    const itemLocation = JSON.parse(item.dataset?.location || '{}');
    const itemName = item.dataset?.name;
    if (itemLocation && itemName) {
      globals.map.setCenter(itemLocation);
      if (!findLocationMarker) {
        findLocationMarker = await initMarker(
          itemLocation,
          false,
          itemName,
          findPlaceIcon,
          false
        );
      }

      markerUpdate(findLocationMarker, itemLocation);
    } else {
      console.warn('Missing data attributes on the clicked element.');
    }
  } else {
    console.warn('Invalid click: No valid list item found.');
  }
}

export function handleClickCloseLocationListBtn() {
  refs.closeLocationListBtn.setAttribute('hidden', true);
  refs.locationList.innerHTML = '';
}

export function handleSubmitCreateRoute(event) {
  event.preventDefault();
  const currentPosition = getDataFromLS('user-location-marker');
  const form = event.target;
  const routeName = form.elements['route-name'].value.trim();
  createRoute(currentPosition, routeName);
  renderUserRoutes(userRoutes);
}

export function handleOpenRoute(event) {
  const routeId = event.target.dataset.routeid;
  console.log(routeId);
}

export function handleEditRoute(event) {
  const routeId = event.target.dataset.routeid;
  console.log(routeId);
}

export function handleDeleteRoute(event) {
  const routeId = event.target.dataset.routeid;
  const deletedRoutes = deleteUserRoute(routeId);
  console.log(deletedRoutes);
}

export function handleShowPointInMap(event) {
  const pointId = event.target.dataset.pointid;
  const pointData = getPointData(pointId);
  showPointOnMap(pointData.coordinate);
  console.log(pointId);
}
