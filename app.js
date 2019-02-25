const createError = require('http-errors');
const express = require('express');
const db = require('./mongodb/db.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const config = require('config-lite')(__dirname);
const chalk = require('chalk');
const router = require('./routes/index');

const app = express();

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin || req.headers.referer || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", 'Express');
	if (req.method == 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.static('./public'));

app.use(logger('dev'));// morgan 用来在命令行输出请求的信息，使用的是 'dev' 模式，还有 combined, common, short, tiny 模式。
app.use(express.json());//用来解析 content-type: application/json, {name: 'tom', age: 1}
app.use(express.urlencoded({ extended: true }));//用来解析 content-type: application/x-www-form-urlencoded, name=tom&age=1
app.use(cookieParser());// cookieParser 中间件要用在 session 中间件之前
app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = connectMongo(session);
app.use(session({
	name: config.session.name,//生成session 的key名 默认为 connect.sid 可以不设置
	secret: config.session.secret,//加密字符串 随便写
	resave: true,//强制保存session 默认为 true
	rolling: false,//在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
	saveUninitialized: false,//强制将未初始化的 session 存储 默认为 true。
	cookie: config.session.cookie,
	store: new MongoStore({
		url: config.url
	})
}));

// 逻辑中间件
router(app);

// 错误中间件，放在所有中间件最后面
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, config.hostname, () => {
	console.log(
		chalk.green(`成功监听：${config.hostname}:${config.port}`)
	)
});
