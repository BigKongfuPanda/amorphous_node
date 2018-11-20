var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var connectMongo = require('connect-mongo');
var config = require('config-lite')(__dirname);
var chalk = require('chalk');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = connectMongo(session);
app.use(session({
	name: config.session.name,//生成session 的key名 默认为 connect.sid 可以不设置
	secret: config.session.secret,//加密字符串 随便写
	resave: true,//强制保存session 默认为 true
	saveUninitialized: false,//强制将未初始化的 session 存储 默认为 true。
	cookie: config.session.cookie,
	store: new MongoStore({
		url: config.url
	})
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.listen(config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	)
});
