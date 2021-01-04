const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const sequelize = require('./mysql/db.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const log4js = require('log4js');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require('config-lite')(__dirname);
const chalk = require('chalk');
const favicon = require('express-favicon');
const router = require('./routes/index');

const app = express();

// 配置log4js
log4js.configure('./config/log4js.json');

app.all('*', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.header(
        'Access-Control-Allow-Origin',
        req.headers.origin || req.headers.referer || '*'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With'
    );
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); //可以带cookies
    res.header('X-Powered-By', 'Express');
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
app.use(favicon(__dirname + '/favicon.ico'));
// const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'});
app.use(logger('dev')); // morgan 用来在命令行输出请求的信息，使用的是 'dev' 模式，还有 combined, common, short, tiny 模式。
app.use(express.json()); //用来解析 content-type: application/json, {name: 'tom', age: 1}
app.use(express.urlencoded({ extended: true })); //用来解析 content-type: application/x-www-form-urlencoded, name=tom&age=1
app.use(cookieParser()); // cookieParser 中间件要用在 session 中间件之前
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        name: config.session.name, //生成session 的key名 默认为 connect.sid 可以不设置
        secret: config.session.secret, //加密字符串 随便写
        resave: true, //强制保存session 默认为 true
        rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        saveUninitialized: false, //强制将未初始化的 session 存储 默认为 true。
        cookie: config.session.cookie,
        store: new SequelizeStore({
            db: sequelize,
        }),
    })
);

// 逻辑中间件
router(app);

// 错误中间件，放在所有中间件最后面
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(config.port, config.hostname, () => {
    console.log(chalk.green(`成功监听：${config.hostname}:${config.port}`));
});

// You can use the .authenticate() function to test if the connection is OK:
sequelize
    .authenticate()
    .then(() => {
        console.log(chalk.green('mysql连接成功'));
    })
    .catch((err) => {
        console.log(chalk.red('mysql连接失败:', err));
    });
