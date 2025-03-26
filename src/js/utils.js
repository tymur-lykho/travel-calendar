export function convertS(s) {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(s / day);
  const hours = Math.floor((s % day) / hour);
  const minutes = Math.floor((s % hour) / minute);
  const seconds = s % minute;

  return { days, hours, minutes, seconds };
}

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function dataToJSON(data) {
  return JSON.stringify(data);
}

export function jsonToData(jsonData) {
  try {
    return JSON.parse(jsonData);
  } catch (error) {
    console.log('Parse error :', error);
  }
}
