export const getTimesList = () => {
  var x = 15; //minutes interval
  var times = []; // time array
  var tt = 0; // start time
  var ap = ["AM", "PM"]; // AM-PM
  for (var i = 0; tt < 24 * 60; i++) {
    var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    var mm = tt % 60; // getting minutes of the hour in 0-55 format
    let val =
      ("0" + (hh % 12)).slice(-2) +
      ":" +
      ("0" + mm).slice(-2) +
      " " +
      ap[Math.floor(hh / 12)];
    times[i] = { id: i + 1, value: val, label: val }; // pushing data in array in [00:00 - 12:00 AM/PM format]
    tt = tt + x;
  }
  return times;
};

export function getFormattedFullDate(date: any) {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var year = date.getFullYear();
  var hour = ("0" + date.getHours()).slice(-2);
  var min = ("0" + date.getMinutes()).slice(-2);
  var seg = ("0" + date.getSeconds()).slice(-2);
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg;
}

export function getFormattedDate(date: any) {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var year = date.getFullYear();
  return year + "-" + month + "-" + day;
}

export function getFormattedTime({
  date,
  isSencond = false,
  isMeridiem = false,
}: any) {
  let hourNumber = date.getHours();
  let meridiem = hourNumber >= 12 ? "PM" : "AM";
  var hour = ("0" + (hourNumber >= 12 ? hourNumber - 12 : hourNumber)).slice(
    -2
  );
  var min = ("0" + date.getMinutes()).slice(-2);
  var seg = ("0" + date.getSeconds()).slice(-2);
  if (isMeridiem) {
    if (isSencond) {
      return `${hour}:${min}:${seg} ${meridiem}`;
    } else {
      return `${hour}:${min} ${meridiem}`;
    }
  }
  if (isSencond) {
    return `${hour}:${min}:${seg}`;
  }
  return `${hour}:${min}`;
}
