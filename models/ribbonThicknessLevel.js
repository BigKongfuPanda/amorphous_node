'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const ribbonThicknessLevelSchema = new Schema({
  ribbonThicknessLevelId: { type: Schema.Types.ObjectId },
  ribbonThicknessLevel: Number,
  ribbonThicknessRange: String
}, {
	collection: 'RibbonThicknessLevel',
	timestamps: true,
  autoIndex: false
});

const RibbonThicknessLevel = mongoose.model('RibbonThicknessLevel', ribbonThicknessLevelSchema);

module.exports = RibbonThicknessLevel;