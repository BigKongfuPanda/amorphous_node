"use strict";

module.exports = {
  hostname: "localhost",
  port: parseInt(process.env.PORT, 10) || 8001,
  // url: 'mongodb://192.168.0.89:27017/amorphous',
  db: {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "daicai",
  },
  tableName: "measure",
};
