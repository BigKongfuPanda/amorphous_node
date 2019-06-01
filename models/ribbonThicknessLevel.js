'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const RibbonThicknessLevel = sequelize.define('ribbonThicknessLevel', {
  ribbonThicknessLevelId: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ribbonThicknessLevel: Sequelize.INTEGER,
  ribbonThicknessRange: Sequelize.STRING
});

module.exports = RibbonThicknessLevel;