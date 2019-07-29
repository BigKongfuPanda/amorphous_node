'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');
const moment = require('moment');

const RibbonType = sequelize.define('ribbonType', {
  ribbonTypeId: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ribbonTypeName: Sequelize.STRING,
  NCode: Sequelize.STRING, // NC编码
  createdAt: {
		type: Sequelize.DATE,
		get() {
			return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	updatedAt: {
		type: Sequelize.DATE,
		get() {
			return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	}
});

module.exports = RibbonType;