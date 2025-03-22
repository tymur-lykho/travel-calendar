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
