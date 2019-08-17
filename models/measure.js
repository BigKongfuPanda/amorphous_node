'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');
const Cast = require('./cast');
const moment = require('moment');

const Measure = sequelize.define('measure',{
  measureId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  castId: Sequelize.INTEGER,// 机组编号
  // 重卷录入信息
  furnace: Sequelize.STRING,// 制带炉号 06-20181120-01/01
  ribbonTypeName: Sequelize.STRING,//材质名称
  ribbonWidth: Sequelize.INTEGER,//带宽
  castDate: {
    type: Sequelize.DATE, 
    get() {
      return moment(this.getDataValue('castDate')).format('YYYY-MM-DD HH:mm:ss');
    }
  }, //生产日期
  caster: Sequelize.STRING, //喷带手
  coilNumber: Sequelize.INTEGER, // 盘号 1, 2, 3
  diameter: Sequelize.FLOAT, // 外径
  coilWeight: Sequelize.FLOAT, // 单盘重量,kg
  coilNetWeight: Sequelize.FLOAT, //单盘净重,kg
  laminationFactor: Sequelize.FLOAT, //叠片系数 0.80
  laminationLevel: Sequelize.STRING, //叠片等级 不合格, 0, 1, 2, 3, 4
  roller: Sequelize.STRING, // 重卷人
  rollMachine: Sequelize.INTEGER, // 重卷机器编号
  isFlat: Sequelize.STRING, // 端面是否平整, 是-平整，否-不平整
  
  orderThickness: Sequelize.STRING, // 订单要求：厚度 20-23, ≤23
  orderLaminationFactor: Sequelize.STRING, // 订单要求：叠片系数 ≥0.78
  orderRibbonToughnessLevels: Sequelize.STRING, // 订单要求：韧性 [A,B,C]
  orderAppearenceLevels: Sequelize.STRING, // 订单要求：外观 [A,B,C]
  // qualifiedThickness: Sequelize.STRING, // 入库要求：厚度 20-23, ≤23
  // qualifiedLaminationFactor: Sequelize.STRING, // 入库要求：叠片系数 ≥0.78
  // qualifiedRibbonToughnessLevels: Sequelize.STRING, // 入库要求：韧性 [A,B,C]
  // qualifiedAppearenceLevels: Sequelize.STRING, // 入库要求：外观 [A,B,C]
  qualifiedDemands: Sequelize.TEXT, //入库要求
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
  ribbonThicknessLevel: Sequelize.FLOAT, // 带材厚度级别
  ribbonToughness: Sequelize.STRING, //带材韧性
  ribbonToughnessLevel: Sequelize.STRING, //带材韧性等级
  appearence: Sequelize.STRING, //带材外观
  appearenceLevel: Sequelize.STRING, //带材外观等级
  ribbonTotalLevel: Sequelize.STRING, //带材综合级别
  isMeasureConfirmed: { type: Sequelize.INTEGER, defaultValue: 0 }, // 检测是否确认可入库：1-是，0-否
  // storageRule: Object, //入库规则
  isStored: { type: Sequelize.INTEGER, defaultValue: 3 }, // 是否入库：1-计划内入库，2-计划外入库，3-否
  unStoreReason: Sequelize.STRING, //不入库原因
  clients: Sequelize.STRING, //去向 [德国，法国]
  measureDate: {
    type: Sequelize.DATE, 
    defaultValue: null, 
    // get() {
    //   return moment(this.getDataValue('measureDate')).format('YYYY-MM-DD HH:mm:ss');
    // }
  }, //检测日期
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
  remainWeight: Sequelize.FLOAT, //结余
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
			return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	updatedAt: {
		type: Sequelize.DATE,
		get() {
			return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	}
});

// Cast.hasMany(Measure, {
//   foreignKey: '_id', targetKey: '_id'
// });

// Measure.sync({alter: true}).then((result) => {
  
// }).catch((err) => {
//   console.log('measure表初始化失败', err.message);
// });

module.exports = Measure;