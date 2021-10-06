"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const moment = require("moment");

const Storage = sequelize.define("storage", {
  storageId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  castId: Sequelize.INTEGER, // 机组编号
  // 重卷录入信息
  furnace: Sequelize.STRING, // 制带炉号 06-20181120-01/01
  coilNumber: Sequelize.INTEGER, // 盘号 1, 2, 3
  ribbonTypeName: Sequelize.STRING, //材质名称
  ribbonWidth: Sequelize.INTEGER, //带宽
  ribbonThickness: Sequelize.FLOAT, // 带材平均厚度, μm
  ribbonThicknessLevel: Sequelize.INTEGER, // 带材厚度级别
  ribbonToughness: Sequelize.STRING, //带材韧性
  ribbonToughnessLevel: Sequelize.STRING, //带材韧性等级
  appearence: Sequelize.STRING, //带材外观描述
  appearenceLevel: Sequelize.STRING, //带材外观等级
  laminationFactor: Sequelize.FLOAT, //叠片系数 0.80
  laminationLevel: Sequelize.STRING, //叠片等级 不合格, 0, 1, 2, 3, 4
  ribbonTotalLevel: Sequelize.STRING, //带材综合级别
  isLowQualified: { type: Sequelize.INTEGER, defaultValue: 0 }, // 是否为低端带材 1-是，0-否
  castDate: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue("castDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
  }, //生产日期
  caster: Sequelize.STRING, //喷带手
  diameter: Sequelize.FLOAT, // 外径
  coilWeight: Sequelize.FLOAT, // 单盘重量,kg
  coilNetWeight: Sequelize.FLOAT, //单盘净重,kg
  remainWeight: Sequelize.FLOAT, //结余

  orderThickness: Sequelize.STRING, // 订单要求：厚度 20-23, ≤23
  orderLaminationFactor: Sequelize.STRING, // 订单要求：叠片系数 ≥0.78
  orderRibbonToughnessLevels: Sequelize.STRING, // 订单要求：韧性 [A,B,C]
  orderAppearenceLevels: Sequelize.STRING, // 订单要求：外观 [A,B,C]
  qualifiedDemands: Sequelize.TEXT, //入库要求
  // storageRule: Object, //入库规则
  isStored: { type: Sequelize.INTEGER, defaultValue: 3 }, // 是否入库：1-计划内入库，2-计划外入库，3-否
  // 库房信息
  inStoreDate: {
    type: Sequelize.DATE,
    defaultValue: null,
    // get() {
    // 	return moment(this.getDataValue('inStoreDate')).format('YYYY-MM-DD HH:mm:ss');
    // }
  }, //入库日期
  outStoreDate: {
    type: Sequelize.DATE,
    defaultValue: null,
    // get() {
    // 	return moment(this.getDataValue('outStoreDate')).format('YYYY-MM-DD HH:mm:ss');
    // }
  }, //出库日期

  clients: Sequelize.STRING, //检测判定去向 [德国，法国] ---> '德国,法国'
  takeBy: Sequelize.STRING, //领走的部门 辊剪，顺义，固安，回炉/置换，粉末厂
  place: Sequelize.STRING, //储存的仓位 1-15-2
  shipRemark: Sequelize.STRING, //发货备注
  // 质量信息
  totalStoredWeight: { type: Sequelize.FLOAT, defaultValue: 0 }, //总入库重量
  inPlanStoredWeight: { type: Sequelize.FLOAT, defaultValue: 0 }, //计划内入库重量
  outPlanStoredWeight: { type: Sequelize.FLOAT, defaultValue: 0 }, //计划外入库重量
  qualityOfA: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为A的重量
  qualityOfB: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为B的重量
  qualityOfC: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为C的重量
  qualityOfD: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为D的重量
  qualityOfE: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为E的重量
  thinRibbonWeight: { type: Sequelize.FLOAT, defaultValue: 0 }, // 薄带重量 ≤23, >=0.75
  highFactorThinRibbonWeight: { type: Sequelize.FLOAT, defaultValue: 0 }, // 高叠片薄带重量 ≤23, >=0.78
  inPlanThickRibbonWeight: { type: Sequelize.FLOAT, defaultValue: 0 }, // 符合订单非薄带：满足订单要求，且厚度为2级别的带材重量
  qualityOfGood: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为好的带材质量：A + 符合订单非薄带
  qualityOfFine: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为良的带材质量：B
  qualityOfNormal: { type: Sequelize.FLOAT, defaultValue: 0 }, // 质量等级为中的带材质量：30**、40**+ 计划外入库
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
  isScanConfirmed: {
    type: Sequelize.INTEGER,
    defaultValue: 0, // 1-确认，0-未确认
  },
});

// Storage.sync({ alter: true })
//   .then((result) => {
//     console.log("Storage表初始化成功");
//   })
//   .catch((err) => {
//     console.log("Storage表初始化失败", err.message);
//   });

module.exports = Storage;
