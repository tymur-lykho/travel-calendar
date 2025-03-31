import axios from 'axios';
import { config } from './config';
import { globals } from './globals';
import { getDataFromLS, saveToLS } from './localStorage';
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
  const routePoint = {
    place: {
      title: 'Start Point',
      coordinate: startPoint,
    },
    description: 'You start your route on this point',
    pointNumber: 0,
  };
  const userRoute = { title: routeName, route: [] };
  userRoute.route.push(routePoint);
  userRoutes.push(userRoute);
  saveToLS('user-routes', userRoutes);
  return userRoute;
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
