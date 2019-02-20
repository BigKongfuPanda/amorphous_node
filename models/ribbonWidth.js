'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const ribbonWidthSchema = new Schema({
  ribbonWidthId: { type: Schema.Types.ObjectId },
  ribbonWidth: String
}, {
	collection: 'RibbonWidth',
	timestamps: true,
  autoIndex: false
});

const RibbonWidth = mongoose.model('RibbonWidth', ribbonWidthSchema);

module.exports = RibbonWidth;