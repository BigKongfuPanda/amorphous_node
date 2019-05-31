'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const LaminationLevel = sequelize.define('laminationLevel', {
  laminationLevelId: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  laminationLevel: Sequelize.INTEGER,
  laminationFactorRange: Sequelize.STRING
});

module.exports = LaminationLevel;