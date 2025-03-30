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

export function convertMetersToKmeters(m) {
  const km = 1000;
  const kkm = 1000000;

  const kkms = Math.floor(m / kkm);
  const kms = Math.floor((m % kkm) / km);
  const meters = m % km;

  return { kkms, kms, meters };
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
