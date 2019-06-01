'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const RibbonType = sequelize.define('ribbonType', {
  ribbonTypeId: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ribbonTypeName: Sequelize.STRING,
  NCode: Sequelize.STRING // NC编码
});

module.exports = RibbonType;