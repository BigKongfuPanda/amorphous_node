"use strict";

module.exports = {
  hostname: "192.168.0.89",
  port: parseInt(process.env.PORT, 10) || 8001,
  // url: 'mongodb://192.168.0.89:27017/amorphous',
  db: {
    host: "192.168.0.89",
    port: "3306",
    user: "root",
    password: "root1234#",
    database: "daicai",
  },
  tableName: "mytable",
};
