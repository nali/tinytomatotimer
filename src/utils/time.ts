export function padNumber(num: number) {
  return num < 10 ? "0" + num : "" + num;
}

export function convertMillisecondsToReadableTime(s: number) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;

  return padNumber(mins) + ":" + padNumber(secs);
}

// Returns ISO formatted date, e.g. 2019-11-19
export function getFormattedCurrentDate() {
  const date = new Date();
  return [
    date.getFullYear(),
    padNumber(date.getMonth() + 1),
    padNumber(date.getDate())
  ].join("-");
}
