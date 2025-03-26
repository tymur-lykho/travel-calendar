import { jsonToData, dataToJSON } from './utils';

export function saveToLS(key, data) {
  localStorage.setItem(key, dataToJSON(data));
}

export function removeFromLS(key) {
  localStorage.removeItem(key);
}

export function getDataFromLS(key) {
  return jsonToData(localStorage.getItem(key));
}
