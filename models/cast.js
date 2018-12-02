'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const castSchema = new Schema({
	castId: Number,//机组编号
	furnace: String,//炉号
	ribbonTypeId: Number,//材质id
	ribbonTypeName: String,//材质名称
	ribbonWidth: Number,//带宽 mm
	record: [
		{
			nozzleSize: String, //喷嘴规格 30*0.25
			caster: String, //喷带手姓名
			heatCupNum: Number, //加热杯数量
			nozzleNum: Number, //喷嘴数量
			treatCoolRoller: String,//冷却辊处理方式 车、修
			meltFurnace: String,//冶炼炉炉号
			tundish: Number,//在线包号
			tundishCar: Number,//在线包车号
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
			coilTimes: Number,//抓取次数
			castTimeEnd: String,//喷带结束时间 2018-12-12 12:12:00
			describe: String,//喷带过程和结果描述
			meltOutWeight: Number,//放钢重量,kg
			rawWeight: Number,//大盘毛重，kg
			isChangeTundish: Number,//是否换包 1-是 0-否
			remark: String, //备注
		}
	],
	createTime: String //创建/更新时间 2018-12-12 12:12:00
}, {
	collection: 'Cast',
	timestamps: true,
	autoIndex: false
});

castSchema.index({furnace: 1});

const Cast = mongoose.model('Cast', castSchema);

module.exports = Cast;