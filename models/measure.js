"use strict";

const Sequelize = require("sequelize");
const sequelize = require("../mysql/db");
const Cast = require("./cast");
const moment = require("moment");
const config = require("config-lite")(__dirname);
const TABLE_NAME = config.tableName;

const Measure = sequelize.define(TABLE_NAME, {
  measureId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  qrCode: Sequelize.STRING, // 二维码编号
  castId: Sequelize.INTEGER, // 机组编号
  // 重卷录入信息
  furnace: Sequelize.STRING, // 制带炉号 06-20181120-01/01
  // ribbonTypeName: Sequelize.STRING, //材质名称
  // ribbonWidth: Sequelize.INTEGER, //带宽
  // castDate: {
  //   type: Sequelize.DATE,
  //   get() {
  //     return moment(this.getDataValue("castDate")).format(
  //       "YYYY-MM-DD HH:mm:ss"
  //     );
  //   },
  // }, //生产日期
  // caster: Sequelize.STRING, //喷带手
  coilNumber: Sequelize.INTEGER, // 盘号 1, 2, 3
  diameter: Sequelize.FLOAT, // 外径
  coilWeight: Sequelize.FLOAT, // 单盘重量,kg
  roller: Sequelize.INTEGER, // 重卷人编号，PLC数据
  rollerName: Sequelize.STRING, // 重卷人姓名
  rollMachine: Sequelize.INTEGER, // 重卷机器编号
  rollMeasureMachine: Sequelize.INTEGER, // 重卷测试设备编号
  isFlat: Sequelize.INTEGER, // 端面是否平整, 1-不平整，0-平整
  dropNum: Sequelize.INTEGER, // 断头数目
  isRollConfirmed: {
    // 是否确认
    type: Sequelize.INTEGER,
    defaultValue: 0, // 1-已确认；0-待确认
  },
  // 检测录入信息
  measurerCode: Sequelize.INTEGER, // 检测人员编号，PLC数据
  orderThickness: Sequelize.STRING, // 订单要求：厚度 20-23, ≤23
  orderLaminationFactor: Sequelize.STRING, // 订单要求：叠片系数 ≥0.78
  orderRibbonToughnessLevels: Sequelize.STRING, // 订单要求：韧性 [A,B,C]
  orderAppearenceLevels: Sequelize.STRING, // 订单要求：外观 [A,B,C]
  qualifiedDemands: Sequelize.TEXT, //入库要求
  measureMachine: Sequelize.INTEGER, //检测设备编号
  realRibbonWidth: Sequelize.FLOAT, //实际带宽
  coilNetWeight: Sequelize.FLOAT, //单盘净重,kg
  laminationFactor: Sequelize.FLOAT, //叠片系数 0.80
  laminationLevel: Sequelize.STRING, //叠片等级 不合格, 0, 1, 2, 3, 4
  ribbonThickness1: Sequelize.FLOAT, //带材厚度点1, μm
  ribbonThickness2: Sequelize.FLOAT, //带材厚度点2, μm
  ribbonThickness3: Sequelize.FLOAT, //带材厚度点3, μm
  ribbonThickness4: Sequelize.FLOAT, //带材厚度点4, μm
  ribbonThickness5: Sequelize.FLOAT, //带材厚度点5, μm
  ribbonThickness6: Sequelize.FLOAT, //带材厚度点6, μm
  ribbonThickness7: Sequelize.FLOAT, //带材厚度点7, μm
  ribbonThickness8: Sequelize.FLOAT, //带材厚度点8, μm
  ribbonThickness9: Sequelize.FLOAT, //带材厚度点9, μm
  ribbonThicknessDeviation: Sequelize.FLOAT, // 带材横向偏差, μm
  ribbonThickness: Sequelize.FLOAT, // 带材平均厚度, μm
  ribbonThicknessLevel: Sequelize.INTEGER, // 带材厚度级别
  ribbonToughness: Sequelize.STRING, //带材韧性
  ribbonToughnessLevel: Sequelize.STRING, //带材韧性等级
  // ribbonToughnessLevelCode: Sequelize.INTEGER, //带材韧性等级符号，PLC的传值
  appearence: Sequelize.STRING, //带材外观描述
  // appearenceCode1: Sequelize.INTEGER, //带材外观符号，PLC传值
  // appearenceCode2: Sequelize.INTEGER, //带材外观符号，PLC传值
  // appearenceCode3: Sequelize.INTEGER, //带材外观符号，PLC传值
  appearenceLevel: Sequelize.STRING, //带材外观等级
  // appearenceLevelCode: Sequelize.INTEGER, //带材外观等级符号，PLC传值
  ribbonTotalLevel: Sequelize.STRING, //带材综合级别
  unQualifiedReason: Sequelize.STRING, // 不合格原因
  isMeasureConfirmed: { type: Sequelize.INTEGER, defaultValue: 0 }, // 检测是否确认可入库：1-是，0-否
  // storageRule: Object, //入库规则
  isStored: { type: Sequelize.INTEGER, defaultValue: 3 }, // 预计入库情况：1-计划内入库，2-计划外入库，3-否
  isStorageConfirmed: { type: Sequelize.INTEGER, defaultValue: 0 }, // 1-是，0-否
  measureConfirmDate: { type: Sequelize.DATE, defaultValue: null }, // 检测申请入库时间
  unStoreReason: Sequelize.STRING, //不入库原因
  clients: Sequelize.STRING, //去向 '德国,法国'
  measureDate: {
    type: Sequelize.DATE,
    defaultValue: null,
  }, //检测日期
  // 库房信息
  // inStoreDate: {
  //   type: Sequelize.DATE,
  //   defaultValue: null,
  // }, //入库日期
  remainWeight: Sequelize.FLOAT, //结余
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
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
    get() {
      return moment(this.getDataValue("createdAt")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
  },
  updatedAt: {
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
    onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
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

// Measure.sync({ alter: true })
//   .then((result) => {})
//   .catch((err) => {
//     console.log("measure表初始化失败", err.message);
//   });

module.exports = Measure;
