const chalk = require("chalk");
const sequelize = require("./db");

// Create Database struct from models
// sequelize
//     .sync({ alter: true })
//     .then(async () => {
//         console.log(
//             chalk.green('初始化数据库成功')
//         );
//     })
//     .catch(error => {
//         console.log(
//             chalk.red('初始化数据库失败: ', error)
//         );
//     });
