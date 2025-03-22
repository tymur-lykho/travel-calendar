// export async function isLand(position) {
//   const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (!data.results || data.results.length === 0) {
//       return false; // Нічого не знайдено - це може бути океан
//     }

//     // Перевіряємо тип місцевості
//     const types = data.results[0].types;
//     console.log('Типи місцевості:', types);

//     // Океан чи море мають типи "natural_feature", "establishment"
//     const isOcean =
//       types.includes('natural_feature') || types.includes('establishment');

//     return !isOcean; // Якщо це не природний об'єкт, значить суша
//   } catch (error) {
//     console.error('Помилка перевірки місцевості:', error);
//     return false;
//   }
// }
