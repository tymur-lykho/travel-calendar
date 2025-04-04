import axios from 'axios';
import { config } from './config';
import { globals } from './globals';
import { getDataFromLS, removeFromLS, saveToLS } from './localStorage';
import { renderUserRoutes } from './render';

export let userRoutes = [];

export async function getRoutes(origin, destination) {
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const requestData = {
    origin: {
      location: {
        latLng: {
          latitude: origin.lat,
          longitude: origin.lng,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: destination.lat,
          longitude: destination.lng,
        },
      },
    },
    travelMode: 'WALK',
    //routingPreference: 'TRAFFIC_UNAWARE',
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
    languageCode: 'en-US',
    units: 'IMPERIAL',
  };

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': config.GM_API_KEY,
      'X-Goog-FieldMask':
        'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
    },
  };

  try {
    const response = await axios.post(url, requestData, headers);
    return response.data;
  } catch (error) {
    console.error(
      'Помилка отримання маршруту:',
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function drawRoute(encodedPolyline) {
  const { geometry } = await google.maps.importLibrary('geometry');

  const path = google.maps.geometry.encoding.decodePath(encodedPolyline);

  const routePath = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });

  routePath.setMap(globals.map);
}

export function removeRoute(routePath) {
  routePath.setMap(null);
}

export function createRoute(startPoint, routeName) {
  const routeId =
    userRoutes.length !== 0 ? userRoutes[userRoutes.length - 1].id + 1 : 0;
  const routePoint = {
    place: {
      id: String(routeId) + '-' + String(0),
      title: 'Start Point',
      coordinate: startPoint,
    },
    description: 'You start your route on this point',
    pointNumber: 0,
  };
  const userRoute = { id: routeId, title: routeName, route: [] };
  userRoute.route.push(routePoint);
  userRoutes.push(userRoute);
  saveToLS('user-routes', userRoutes);
  return userRoute;
}

export function deleteUserRoute(routeId) {
  let deletedRoute;
  if (userRoutes.length === 1) {
    deletedRoute = userRoutes[0];
    userRoutes = [];
    removeFromLS('user-routes');
  } else {
    deletedRoute = userRoutes.splice(routeId, 1);
    saveToLS('user-routes', userRoutes);
  }
  renderUserRoutes(userRoutes);
  return deletedRoute;
}

export function addPointToRoute(point, userRoute) {
  userRoutes = getDataFromLS('user-routes');
  const routePoint = {
    place: {
      title: 'point.title',
      coordinate: 'point.position',
    },
    description: 'Added point to route',
  };
  routePoint.pointNumber += 1;
  userRoute.push(routePoint);
  saveToLS('user-routes', userRoutes);
}

export function initUserRoutes() {
  userRoutes = getDataFromLS('user-routes') || [];
  renderUserRoutes(userRoutes);
  console.log('Init User Routes');
}

export function getPointData(pointId) {
  const route = userRoutes.find(userRoute =>
    userRoute.route.some(point => point.place.id === pointId)
  );

  const pointData = route
    ? route.route.find(point => point.place.id === pointId).place
    : null;

  return pointData;
}
