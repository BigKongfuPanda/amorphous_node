'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const Melt = sequelize.define('melt', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	castId: Sequelize.INTEGER,// 机组编号
	furnace: {
		type: Sequelize.Sequelize.STRING,
		primaryKey: true
	},// 制带炉号 06-20181120-01/01
	ribbonTypeId: {
		type: Sequelize.INTEGER,
		autoIncrement: true
	}, // 材质id
	ribbonTypeName: Sequelize.STRING,//材质名称
	bucket: Sequelize.STRING,// 配料桶号
	melter: Sequelize.STRING,// 熔炼人
	meltFurnace: Sequelize.STRING,// 冶炼炉炉号 A 或 B
	newAlloyNumber: Sequelize.STRING,// 新料炉号 新B-2018-12-12
	newAlloyWeight: Sequelize.FLOAT,// 新料重量
	oldAlloyNumber: Sequelize.STRING,// 加工料炉号 加B-2018-12-12
	oldAlloyWeight: Sequelize.FLOAT,//加工料重量
	mixAlloyNumber: Sequelize.STRING,// 回炉锭炉号
	mixAlloyWeight: Sequelize.FLOAT,// 回炉锭重量
	highNbNumber: Sequelize.STRING,// 高铌料炉号
	highNbWeight: Sequelize.FLOAT,// 高铌料重量
	Si: Sequelize.FLOAT,// 硅重量
	Ni: Sequelize.FLOAT,// Ni重量
	Cu: Sequelize.FLOAT,// Cu重量
	BFe: Sequelize.FLOAT,// 硼铁硅重量
	NbFe: Sequelize.FLOAT,// 铌铁重量
	alloyTotalWeight: Sequelize.FLOAT,//总重量
	alloyOutWeight: Sequelize.FLOAT,// 放钢重量
	alloyFixWeight: Sequelize.FLOAT,// 总重量修正
	updatePerson: Sequelize.STRING, // 更新者
	createPerson: Sequelize.STRING, // 创建者
	remark: Sequelize.STRING, // 备注
	createTime: Sequelize.DATE // 冶炼时间，00:00:00 - 08:00:00 之间的算上一天，不能算当天
});

module.exports = Melt;