function toFixed(value = 0, pricion = 2) {
  if (typeof value !== 'number') {
    value = Number(value);
  }
  return value.toFixed(pricion);
}

function percent(value = 0, pricion = 2) {
  if (typeof value !== 'number') {
    value = Number(value);
  }
  return `${(value * 100).toFixed(2)}%`;
}

module.exports = {
  toFixed,
  percent
}