"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");

const RibbonWidth = sequelize.define("ribbonWidth", {
  ribbonWidthId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ribbonWidth: Sequelize.FLOAT,
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

// RibbonWidth.sync({ alter: true })
//   .then((result) => {})
//   .catch((err) => {
//     console.log("ribbonWidth表初始化失败", err.message);
//   });

module.exports = RibbonWidth;
