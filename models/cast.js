'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const Cast = sequelize.define('cast', {
	_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	castId: Sequelize.INTEGER,//机组编号
	furnace: Sequelize.STRING,//炉号
	caster: Sequelize.STRING, //喷带手姓名, 不变
	team: Sequelize.STRING, // 班组，甲乙丙丁
	ribbonWidth: Sequelize.INTEGER,//带宽 mm
	ribbonTypeName: Sequelize.STRING,//材质名称
	nozzleNum: Sequelize.INTEGER, //喷嘴数量
	heatCupNum: Sequelize.INTEGER, //加热杯数量
	tundishCar: Sequelize.INTEGER,//包车，不变
	tundish: Sequelize.INTEGER,//在线包号，不变
	isChangeTundish: Sequelize.INTEGER,//是否换包 1-是 0-否
	meltOutWeight: Sequelize.FLOAT,//放钢重量,kg
	rawWeight: Sequelize.FLOAT,//大盘毛重，kg
	remark: Sequelize.STRING, //备注
	castTimes: Sequelize.INTEGER, //开包次数
	updatePerson: Sequelize.STRING, // 更新者
	createPerson: Sequelize.STRING, // 创建者
	uselessRibbonWeight: {type: Sequelize.FLOAT, default: 0 }, //废带重量
	createTime: Sequelize.DATE, // 冶炼时间，00:00:00 - 08:00:00 之间的算上一天，不能算当天
	// record: [
	// 	{
	// 		nozzleSize: String, //喷嘴规格 30*0.25
	// 		treatCoolRoller: String,//冷却辊处理方式 车、修
	// 		coolRollerThickness: Number, //冷却辊厚度 mm
	// 		ReceiveMeltTime: String,//接钢时间
	// 		tundishTemperatureWithoutMelt: Number,//接钢前包温
	// 		tundishTemperatureWithMelt: Number,//接钢后包温
	// 		installNozzleTime: String,//装杯时间
	// 		castTimeStart: String,//喷带开始时间
	// 		pressure: Number,//开包压力
	// 		tundishTemperatureCasting: Number,//喷带时包温
	// 		coolRollerTemperatureBeforeCast : String,//喷带开始时冷却辊进出水水温 32-32
	// 		coolRollerTemperatureAfterCast : String,//喷带结束时冷却辊进出水水温 32-35
	// 		castLocation: String,//喷带位置
	// 		coilTimes: String,//抓取次数, 1, 2, 3, >3
	// 		castTimeEnd: String,//喷带结束时间 2018-12-12 12:12:00
	// 		describe: String//喷带过程和结果描述
	// 	}
	// ]
	record: Sequelize.TEXT
});

module.exports = Cast;