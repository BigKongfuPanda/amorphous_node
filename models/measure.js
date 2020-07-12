"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const Cast = require("./cast");
const moment = require("moment");

const Measure = sequelize.define("mytable", {
  measureId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  qrCode: Sequelize.STRING, // 二维码编号
  // castId: Sequelize.INTEGER, // 机组编号
  // 重卷录入信息
  furnace: Sequelize.STRING, // 制带炉号 06-20181120-01/01
  // ribbonTypeName: Sequelize.STRING, //材质名称
  // ribbonWidth: Sequelize.INTEGER, //带宽
  castDate: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue("castDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
  }, //生产日期
  // caster: Sequelize.STRING, //喷带手
  coilNumber: Sequelize.INTEGER, // 盘号 1, 2, 3
  diameter: Sequelize.FLOAT, // 外径
  coilWeight: Sequelize.FLOAT, // 单盘重量,kg
  coilNetWeight: Sequelize.FLOAT, //单盘净重,kg
  roller: Sequelize.STRING, // 重卷人
  rollerNumber: Sequelize.INTEGER, // 重卷人编号
  rollMachine: Sequelize.INTEGER, // 重卷机器编号
  isFlat: Sequelize.INTEGER, // 端面是否平整, 1-平整，0-不平整
  isRollConfirmed: {
    // 是否确认
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  rollMeasureMachine: Sequelize.INTEGER, // 重卷测试设备编号
  dropNum: Sequelize.INTEGER, // 断头数目
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

// Cast.hasMany(Measure, {
//   foreignKey: '_id', targetKey: '_id'
// });

Measure.sync({ alter: true })
  .then((result) => {})
  .catch((err) => {
    console.log("measure表初始化失败", err.message);
  });

module.exports = Measure;
