'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const RibbonToughnessLevel = sequelize.define('ribbonToughnessLevel', {
  ribbonToughnessLevelId: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ribbonToughnessLevel: Sequelize.STRING,
  ribbonToughness: Sequelize.STRING
});

module.exports = RibbonToughnessLevel;