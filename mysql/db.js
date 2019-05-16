'use strict';

const Sequelize = require('sequelize');
const config = require('config-lite')(__dirname);

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
     // 请参考 Querying - 查询 操作符 章节
    operatorsAliases: false
  }
);