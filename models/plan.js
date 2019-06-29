'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');
const moment = require('moment');

const Plan = sequelize.define('plan',{
  planId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: Sequelize.Sequelize.STRING,//排产日期 2018-12-01
  approved: { type: Sequelize.INTEGER, defaultValue: 0 }, // 是否审批，1-是，0-否
  remark: Sequelize.STRING,//备注
  fileNumber: Sequelize.STRING,//文件编号 QEHAT-FJ/D-C03-036-C/0
  castId: Sequelize.INTEGER, // 机组编号
  team: Sequelize.STRING,// 班组 早
  taskOrder: Sequelize.STRING, //任务单号
  // ribbonTypeId: { type: Sequelize.INTEGER}, // 材质id
  ribbonTypeName: Sequelize.STRING,//材质名称 1k107B
  ribbonWidth: Sequelize.FLOAT, // 带宽
  client: Sequelize.STRING, //客户 
  furnace: Sequelize.STRING, //制带炉号 06-20181120-01/01
  alloyWeight: { type: Sequelize.FLOAT, allowNull: true }, // 单炉投入重量 KG
  castTime: Sequelize.STRING, //计划喷带时间 8:00-10:00
  rawWeight: Sequelize.FLOAT, // 实际产出的大盘毛重 KG，与 喷带记录表关联
  orderThickness: Sequelize.STRING, // 订单要求：厚度 20-23, ≤23
  orderLaminationFactor: Sequelize.STRING, // 订单要求：叠片系数 ≥0.78
  orderRibbonToughnessLevels: Sequelize.STRING, // 订单要求：韧性 [A,B,C]
  orderAppearenceLevels: Sequelize.STRING, // 订单要求：外观 [A,B,C]
  qualifiedThickness: Sequelize.STRING, // 入库要求：厚度 20-23, ≤23
  qualifiedLaminationFactor: Sequelize.STRING, // 入库要求：叠片系数 ≥0.78
  qualifiedRibbonToughnessLevels: Sequelize.STRING, // 入库要求：韧性 [A,B,C]
  qualifiedAppearenceLevels: Sequelize.STRING, // 入库要求：外观 [A,B,C]
  realRibbonWidth: Sequelize.FLOAT, // 实际带宽
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

module.exports = Plan;