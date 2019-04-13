export const days = _getDays();

function _getDays() {
  let days = [];
  for (let i = 1; i < 29; i++) {
    days.push({
      dkey: i + '',
      dvalue: i + ''
    });
  }
  return days;
}
