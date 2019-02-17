'use strict';

const melt = require('./melt');
const cast = require('./cast');
const plan = require('./plan');
const user = require('./user');
const measure = require('./measure');
const ribbonType = require('./ribbonType');

// 检验登录态的中间件
function checkLogin(req, res, next) {
  if (req.path.indexOf('/user/login') < 0 && !req.session.userId) {
    return res.send({
      status: 0,
      message: '无访问权限',
      data: {
        access: 302
      }
    });
  } else {
    next();//继续往下走
  }
}

module.exports = app => {
  app.use(checkLogin);
  app.use('/user', user);
  app.use('/melt', melt);
  app.use('/cast', cast);
  app.use('/plan', plan);
  app.use('/measure', measure);
  app.use('/ribbonType', ribbonType);
};
