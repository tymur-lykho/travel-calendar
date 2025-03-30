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
