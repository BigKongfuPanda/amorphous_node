"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");

const AppearenceLevel = sequelize.define("appearenceLevel", {
  appearenceLevelId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  appearence: Sequelize.STRING,
  appearenceLevel: Sequelize.STRING,
  appearenceLevelCode: Sequelize.INTEGER, // PLC中映射值
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

AppearenceLevel.sync({ alter: true })
  .then((result) => {})
  .catch((err) => {
    console.log("AppearenceLevel表初始化失败", err.message);
  });

module.exports = AppearenceLevel;
