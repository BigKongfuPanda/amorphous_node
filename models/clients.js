"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");

const Clients = sequelize.define("clients", {
  clientsId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client: Sequelize.STRING,
  isFlat: Sequelize.INTEGER, // 是否需要平整，是/否, 1-否，0-是
  createdAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue("createdAt")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
  },
  updatedAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue("updatedAt")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
  },
});

// Clients.sync({alter: true}).then((result) => {

// }).catch((err) => {
//   console.log('clients表初始化失败', err.message);
// });

module.exports = Clients;
