"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");

const RibbonToughnessLevel = sequelize.define("ribbonToughnessLevel", {
  ribbonToughnessLevelId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ribbonToughnessLevel: Sequelize.STRING,
  ribbonToughness: Sequelize.STRING,
  ribbonToughnessLevelCode: Sequelize.INTEGER, // PLC中映射值
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

RibbonToughnessLevel.sync({ alter: true })
  .then((result) => {})
  .catch((err) => {
    console.log("ribbonToughnessLevel表初始化失败", err.message);
  });

module.exports = RibbonToughnessLevel;
