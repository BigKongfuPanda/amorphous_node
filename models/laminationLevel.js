'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const laminationLevelSchema = new Schema({
  laminationLevelId: { type: Schema.Types.ObjectId },
  laminationLevel: Number,
  laminationFactorRange: String
}, {
	collection: 'LaminationLevel',
	timestamps: true,
  autoIndex: false
});

const LaminationLevel = mongoose.model('LaminationLevel', laminationLevelSchema);

module.exports = LaminationLevel;