'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const ReturnGoods = sequelize.define('returnGoods', {
  returnGoodsId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  castId: Sequelize.INTEGER,// 机组编号
  // 重卷录入信息
  furnace: Sequelize.STRING,// 制带炉号 06-20181120-01/01
  ribbonTypeName: Sequelize.STRING,//材质名称
  ribbonWidth: Sequelize.INTEGER,//带宽
  castDate: Sequelize.DATE, //生产日期
  caster: Sequelize.STRING, //喷带手
  coilNumber: Sequelize.INTEGER, // 盘号 1, 2, 3
  diameter: Sequelize.FLOAT, // 外径
  coilWeight: Sequelize.FLOAT, // 单盘重量,kg
  coilNetWeight: Sequelize.FLOAT, //单盘净重,kg
  laminationFactor: Sequelize.FLOAT, //叠片系数 0.80
  laminationLevel: Sequelize.STRING, //叠片等级 不合格, 0, 1, 2, 3, 4
  // 检测录入信息
  realRibbonWidth: Sequelize.FLOAT,//实际带宽
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
  appearence: Sequelize.STRING, //带材外观
  appearenceLevel: Sequelize.STRING, //带材外观等级
  ribbonTotalLevel: Sequelize.STRING, //带材综合级别
  isMeasureConfirmed: { type: Sequelize.INTEGER, defaultValue: 0 }, // 检测是否确认可入库：1-是，0-否
  isStored: { type: Sequelize.INTEGER, defaultValue: 3 }, // 是否入库：1-计划内入库，2-计划外入库，3-否, 4-退货入库
  unStoreReason: Sequelize.STRING, //不入库原因
  clients: Sequelize.STRING, //去向 德国，法国
  measureDate: {type: Sequelize.DATE, defaultValue: null}, //检测日期
  // 库房信息
  inStoreDate: {type: Sequelize.DATE, defaultValue: null}, //入库日期
  outStoreDate: {type: Sequelize.DATE, defaultValue: null}, //出库日期
  remainWeight: Sequelize.FLOAT, //结余
  takeBy: Sequelize.STRING, //领走的部门 辊剪，顺义，固安，回炉/置换，粉末厂
  place: Sequelize.STRING, //储存的仓位 1-15-2
  shipRemark: Sequelize.STRING //发货备注
});

ReturnGoods.sync({ alter: true }).then((result) => {

}).catch((err) => {
  console.log('ReturnGoods表初始化失败', err.message);
});;

module.exports = ReturnGoods;