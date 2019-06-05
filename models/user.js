'use strict';

const Sequelize =  require('sequelize');
const sequelize = require('../mysql/db');
const moment = require('moment');
const chalk = require('chalk');

const User = sequelize.define('user', {
  userId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roleId: Sequelize.INTEGER,// 1- 厂长 super, 2-生产计划 admin, 3-普通管理员 admin, 4-重卷 chongjuan，5-检测 jiance，6-库房 kufang，7-六号机组-喷带, 8-六号机组-化钢， 9-七个号机组-喷带, 10-七号机组-化钢，11-八号机组-喷带, 12-八号机组-化钢，13-九号机组-喷带, 14-九号机组-化钢
  username: { type: Sequelize.STRING, unique: true }, // 登录名
  adminname: Sequelize.STRING, // 真实姓名
  password: { type: Sequelize.STRING, defaultValue: '123456' },
  loginTime: Sequelize.STRING, //登陆时间
  createTime: Sequelize.STRING // 创建时间
});

// User
//   .sync({ alter: true})
//   .then(async () => {
//     chalk.green('初始化user表成功');
//     // 创建超级管理员
//     try {
//       const superAdmin = await User.findOne({
//         where: {
//           username: 'heyuntao'
//         }
//       });
//       if (superAdmin) {
//         return;
//       }
//       await User.create({
//         roleId: 1,
//         username: 'heyuntao',
//         adminname: '何云涛',
//         createTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
//       });
//       console.log(
//         chalk.green('创建超级管理员成功')
//       );
//     } catch(error) {
//       console.log(
//         chalk.red('创建超级管理员失败：', error)
//       );
//     }
//   })
//   .catch(error => {
//     console.log(
//       chalk.red('初始化user表失败: ', error)
//     );
//   });

module.exports = User;