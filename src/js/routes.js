import axios from 'axios';
import { config } from './config';
import { globals } from './globals';

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
