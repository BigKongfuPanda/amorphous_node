'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const meltSchema = new Schema({
	castId: Number,// 机组编号
	furnace: String,// 制带炉号 06-20181120-01/01
	ribbonTypeId: Schema.Types.ObjectId, // 材质id
	ribbonTypeName: String,//材质名称
	bucket: String,// 配料桶号
	melter: String,// 熔炼人
	meltFurnace: String,// 冶炼炉炉号 A 或 B
	newAlloyNumber: String,// 新料炉号 新B-2018-12-12
	newAlloyWeight: Number,// 新料重量
	oldAlloyNumber: String,// 加工料炉号 加B-2018-12-12
	oldAlloyWeight: Number,//加工料重量
	mixAlloyNumber: String,// 回炉锭炉号
	mixAlloyWeight: Number,// 回炉锭重量
	highNbNumber: String,// 高铌料炉号
	highNbWeight: Number,// 高铌料重量
	Si: Number,// 硅重量
	Ni: Number,// Ni重量
	Cu: Number,// Cu重量
	BFe: Number,// 硼铁硅重量
	NbFe: Number,// 铌铁重量
	alloyTotalWeight: Number,//总重量
	alloyOutWeight: Number,// 放钢重量
	alloyFixWeight: Number,// 总重量修正
	updatePerson: String, // 更新者
	createPerson: String, // 创建者
	remark: String // 备注
}, {
	collection: 'Melt',
	timestamps: true,
	autoIndex: false
});

meltSchema.index({furnace: 1});

const Melt = mongoose.model('Melt', meltSchema);

module.exports = Melt;