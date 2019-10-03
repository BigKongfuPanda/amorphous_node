// 检验登录态的中间件
function checkLogin(req, res, next) {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log(req.path);
  if (req.path.indexOf("/login") < 0 && !req.session.userId) {
    return res.send({
      status: 302,
      message: "无访问权限"
    });
  } else {
    next(); //继续往下走
  }
}

module.exports = checkLogin;
