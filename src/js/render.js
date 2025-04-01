import {
  handleDeleteRoute,
  handleEditRoute,
  handleOpenRoute,
  handleShowPointInMap,
} from './handlers';
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
			<h5>${userRoute.title}</h5>
			<button id="open-route" data-routeid="${userRoute.id}" type="button">Open Route</button>
			<button id="edit-route" data-routeid="${userRoute.id}" type="button">Edit Route</button>
			<button id="delete-route" data-routeid="${userRoute.id}" type="button">Delete Route</button>
			<ol
      class="user-route draggable-container"
      id="user-route"
      style="border: 1px solid red"
    >
		<li> 
			<h6>${userRoute.route[0].place.title}</h6>
			<button type="button" id="show-route-point" data-pointid="${userRoute.route[0].place.id}">Show this point</button>
		</li>
		</ol>`;
    })
    .join('');

  refs.userRoutesList.insertAdjacentHTML('beforeend', markup);

  const openRouteBtns = document.querySelectorAll('#open-route');
  const editRouteBtns = document.querySelectorAll('#edit-route');
  const deleteRouteBtns = document.querySelectorAll('#delete-route');
  const showPointBtns = document.querySelectorAll('#show-route-point');

  openRouteBtns.forEach(btn => {
    btn.addEventListener('click', handleOpenRoute);
  });

  editRouteBtns.forEach(btn => {
    btn.addEventListener('click', handleEditRoute);
  });

  deleteRouteBtns.forEach(btn => {
    btn.addEventListener('click', handleDeleteRoute);
  });

  showPointBtns.forEach(btn => {
    btn.addEventListener('click', handleShowPointInMap);
  });
}

export function renderDialogForAddPointToRoute(userRoutes) {
  const selectOptions = userRoutes
    .map(route => {
      return `<option value="${route.id}">${route.title}</option>`;
    })
    .join('');

  const markup = `
  	<label for="route-select">Оберіть маршрут:</label>
		<select id="route-select" name="route">
			${selectOptions}
		</select>

  	<button type="button" id="create-route-btn">Створити новий маршрут</button>

		<label for="point-title">Назва точки:</label>
		<input type="text" id="point-title" name="point-title" required />

		<label for="point-description">Опис точки:</label>
		<textarea id="point-description" name="point-description"></textarea>

  	<button type="submit">Додати точку</button>
	`;

  refs.dialogForm.insertAdjacentHTML('beforeend', markup);
  refs.dialog.showModal();
}
