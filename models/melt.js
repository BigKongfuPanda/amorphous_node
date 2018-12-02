'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const meltSchema = new Schema({
	castId: Number,
	furnace: String,
	ribbonTypeId: Number,
	ribbonTypeName: String,
	bucket: Number,
	melter: String,
	meltFurnace: String,
	newAlloyNumber: String,
	newAlloyWeight: Number,
	oldAlloyNumber: String,
	oldAlloyWeight: Number,
	mixAlloyNumber: String,
	mixAlloyWeight: Number,
	highNbNumber: String,
	highNbWeight: Number,
	Si: Number,
	Ni: Number,
	Cu: Number,
	BFe: Number,
	NbFe: Number,
	alloyTotalWeight: Number,
	alloyOutWeight: Number,
	alloyFixWeight: Number,
	remark: String,
	createTime: String
}, {
	collection: 'Melt',
	timestamps: true,
	autoIndex: false
});

meltSchema.index({furnace: 1});

const Melt = mongoose.model('Melt', meltSchema);

module.exports = Melt;