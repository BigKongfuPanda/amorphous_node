'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');
const moment = require('moment');

const RibbonWidth = sequelize.define('ribbonWidth', {
  ribbonWidthId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ribbonWidth: Sequelize.INTEGER,
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

module.exports = RibbonWidth;