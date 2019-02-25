'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const castSchema = new Schema({
	castId: Number,//机组编号
	furnace: String,//炉号
	caster: String, //喷带手姓名, 不变
	ribbonWidth: Number,//带宽 mm
	ribbonTypeId: Schema.Types.ObjectId, // 材质id
	ribbonTypeName: String,//材质名称
	nozzleNum: Number, //喷嘴数量
	heatCupNum: Number, //加热杯数量
	tundishCar: Number,//包车，不变
	tundish: Number,//在线包号，不变
	isChangeTundish: Number,//是否换包 1-是 0-否
	meltOutWeight: Number,//放钢重量,kg
	rawWeight: Number,//大盘毛重，kg
	remark: String, //备注
	castTimes: Number, //开包次数
	updatePerson: String, // 更新者
	createPerson: String, // 创建者
	record: [
		{
			nozzleSize: String, //喷嘴规格 30*0.25
			treatCoolRoller: String,//冷却辊处理方式 车、修
			coolRollerThickness: Number, //冷却辊厚度 mm
			ReceiveMeltTime: String,//接钢时间
			tundishTemperatureWithoutMelt: Number,//接钢前包温
			tundishTemperatureWithMelt: Number,//接钢后包温
			installNozzleTime: String,//装杯时间
			castTimeStart: String,//喷带开始时间
			pressure: Number,//开包压力
			tundishTemperatureCasting: Number,//喷带时包温
			coolRollerTemperatureBeforeCast : String,//喷带开始时冷却辊进出水水温 32-32
			coolRollerTemperatureAfterCast : String,//喷带结束时冷却辊进出水水温 32-35
			castLocation: String,//喷带位置
			coilTimes: String,//抓取次数, 1, 2, 3, >3
			castTimeEnd: String,//喷带结束时间 2018-12-12 12:12:00
			describe: String//喷带过程和结果描述
		}
	]
}, {
	collection: 'Cast',
	timestamps: true,
	autoIndex: false
});

castSchema.index({furnace: 1});

const Cast = mongoose.model('Cast', castSchema);

module.exports = Cast;