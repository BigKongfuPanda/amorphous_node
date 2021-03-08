"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");
const chalk = require("chalk");

const Roller = sequelize.define("roller", {
  rollerId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roller: { type: Sequelize.INTEGER, unique: true }, // 编号
  rollerName: Sequelize.STRING, // 真实姓名
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

// Roller.sync({ alter: true })
//   .then((result) => {
//     console.log(chalk.green("roller表初始化成功"));
//   })
//   .catch((err) => {
//     console.log(chalk.red("roller表初始化失败", err.message));
//   });

module.exports = Roller;
