const { isNumber } = require("lodash");

function toFixed(value = 0, pricion = 2) {
  if (typeof value !== "number") {
    value = Number(value);
  }
  return value.toFixed(pricion);
}

function percent(value = 0, pricion = 2) {
  if (typeof value !== "number") {
    value = Number(value);
  }
  return `${(value * 100).toFixed(2)}%`;
}

function filter(obj = {}) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value != undefined) {
      newObj[key] = value;
    }
  });
  return newObj;
}

function handleSqlQuery({ equal = {}, json = {}, between = {} }) {
  let arr = [];
  Object.keys(filter(equal)).forEach((key) => {
    const value = isNumber(equal[key]) ? equal[key] : `'${equal[key]}'`;
    arr.push(`${key}=${value}`);
  });
  Object.keys(filter(json)).forEach((key) => {
    const list = JSON.parse(json[key]).map((item) =>
      isNumber(item) ? item : `'${item}'`
    );
    const str = list.join();
    if (list.length > 0) {
      arr.push(`${key} in (${str})`);
    }
  });
  Object.keys(filter(between)).forEach((key) => {
    const isNumberValue = isNumber(between[key][0]);
    const str = isNumberValue
      ? `${key} BETWEEN ${between[key][0]} AND ${between[key][1]}`
      : `${key} BETWEEN '${between[key][0]}' AND '${between[key][1]}'`;
    arr.push(str);
  });
  let query = arr.join(" AND ");
  if (query !== "") {
    query = `WHERE ${query}`;
  }
  return query;
}

const valueToString = (value) => {
  let _value = "";
  if (value !== undefined || value !== null) {
    try {
      _value = value.toString();
    } catch (error) {
      _value = value;
    }
  }
  return _value;
};

module.exports = {
  toFixed,
  percent,
  filter,
  handleSqlQuery,
  valueToString,
};
