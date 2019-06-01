'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');

const RibbonWidth = sequelize.define('ribbonWidth', {
  ribbonWidthId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ribbonWidth: Sequelize.INTEGER
});

module.exports = RibbonWidth;