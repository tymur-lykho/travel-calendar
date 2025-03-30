export async function initInfoWindow() {
  const { InfoWindow } = await google.maps.importLibrary('maps');
  console.log('Init InfoWindow');
  return new InfoWindow();
}
