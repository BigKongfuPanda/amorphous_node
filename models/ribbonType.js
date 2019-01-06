'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const ribbonTypeSchema = new Schema({
  ribbonTypeName: String
}, {
	collection: 'RibbonType',
	timestamps: true,
	autoIndex: false
});

const RibbonType = mongoose.model('RibbonType', ribbonTypeSchema);

module.exports = RibbonType;