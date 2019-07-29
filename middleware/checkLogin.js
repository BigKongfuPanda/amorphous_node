// 检验登录态的中间件
function checkLogin(req, res, next) {
  if (req.path.indexOf('/user/login') < 0 && !req.session.userId) {
    return res.send({
      status: 302,
      message: '无访问权限'
    });
  } else {
    next();//继续往下走
  }
}

module.exports = checkLogin;