'use strict';

const Sequelize = require('sequelize');
const config = require('config-lite')(__dirname);
const operatorsAliases = require('./operatorsAliases');
const chalk = require('chalk');

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
    // Specify options, which are used when sequelize.define is called.
    // The following example:
    //   define: { timestamps: false }
    // is basically the same as:
    //   Model.init(attributes, { timestamps: false });
    //   sequelize.define(name, attributes, { timestamps: false });
    // so defining the timestamps for each model will be not necessary
    define: {
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      // 默认添加时间戳属性 (updatedAt, createdAt)
      timestamps: true,
      // 设置为true则将自动设置所有属性的字段选项为下划线命名方式。
      underscored: false,
      // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
      freezeTableName: true,
    },
     // Querying - 查询操作符的别名
    operatorsAliases: operatorsAliases
  }
);

// Create Database struct from models
// sequelize
//   .sync()
//   .then(async () => {
//     console.log(
//       chalk.green('初始化数据库成功')
//     );
//   })
//   .catch(error => {
//     console.log(
//       chalk.red('初始化数据库失败: ', error)
//     );
//   });

module.exports = sequelize;