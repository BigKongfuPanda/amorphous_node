"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");
const chalk = require("chalk");

const LinerWeight = sequelize.define("linerWeight", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ribbonWidth: Sequelize.INTEGER, // 带宽
  linerWeight: Sequelize.FLOAT, // 重量
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

// LinerWeight.sync({ alter: true })
//   .then((result) => {
//     console.log(chalk.green("LinerWeight表初始化成功"));
//   })
//   .catch((err) => {
//     console.log(chalk.red("LinerWeight表初始化失败", err.message));
//   });

module.exports = LinerWeight;
