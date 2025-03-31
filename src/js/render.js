import { refs } from './refs';
import { dataToJSON } from './utils';

export function renderFindLocation(data) {
  refs.locationList.innerHTML = '';

  const markup = data
    .map(({ formatted_address, geometry }) => {
      return `<li class='location-item' data-location='${dataToJSON(
        geometry.location
      )}' data-name='${formatted_address}'>
		<h3>${formatted_address}</h3>
		<p>Coordinates: ${geometry.location.lat}, ${geometry.location.lng}</p>
		</li>`;
    })
    .join('');

  refs.locationList.insertAdjacentHTML('beforeend', markup);
}

export function renderUserRoutes(userRoutes) {
  refs.userRoutesList.innerHTML = '';

  const markup = userRoutes
    .map(userRoute => {
      return `
			<h5>${userRoute}</h5>
			<ol
      class="user-route draggable-container"
      id="user-route"
      style="border: 1px solid red"
    >
		</ol>`;
    })
    .join('');

  refs.userRoutesList.insertAdjacentHTML('beforeend', markup);
}
