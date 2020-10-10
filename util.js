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

function handleSqlQuery({ equal = {}, json = {} }) {
  let arr = [];
  Object.keys(filter(equal)).forEach((key) => {
    const value = isNumber(equal[key]) ? equal[key] : `'${equal[key]}'`;
    // const value = `'${equal[key]}'`;
    arr.push(`${key}=${value}`);
  });
  Object.keys(filter(json)).forEach((key) => {
    const list = JSON.parse(json[key]).map((item) =>
      isNumber(item) ? item : `'${item}'`
    );
    const str = list.join();
    const idx = key.indexOf("Json");
    const k = key.substring(0, idx);
    if (list.length > 0) {
      arr.push(`${k} in (${str})`);
    }
  });
  let query = arr.join(" AND ");
  if (query !== "") {
    query += `WHERE ${query}`;
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
