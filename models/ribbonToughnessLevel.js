'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const ribbonToughnessLevelSchema = new Schema({
  ribbonToughnessLevelId: { type: Schema.Types.ObjectId },
  ribbonToughnessLevel: String,
  ribbonToughness: String
}, {
	collection: 'RibbonToughnessLevel',
	timestamps: true,
  autoIndex: false
});

const RibbonToughnessLevel = mongoose.model('RibbonToughnessLevel', ribbonToughnessLevelSchema);

module.exports = RibbonToughnessLevel;