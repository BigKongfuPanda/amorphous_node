'use strict';

const melt = require('./melt');
const cast = require('./cast');

// 检验登录态的中间件
function checkLogin(req, res, next) {
  if (req.path.indexOf('/login') < 0 && !req.session.userId) {
    return res.redirect('login'); // 调转到登录页面
  } else {
    next();//继续往下走
  }
}

module.exports = app => {
  // app.use(checkLogin);
  app.use('/melt', melt);
  app.use('/cast', cast);
};
