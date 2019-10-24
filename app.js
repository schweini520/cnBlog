//引入模块 2019/09/04--Wayne
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup--设置视图文件夹的位置
app.set('views', path.join(__dirname, 'views'));
//设置项目使用ejs模板引擎
app.set('view engine', 'ejs');

//使用日志记录中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//使用cookieParser中间件
app.use(cookieParser());
//使用express默认的static中间件设置静态资源文件夹的位置
app.use(express.static(path.join(__dirname, 'public')));

//使用bodyParser中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//应用的session配置
app.use(session({
  secret:'blog',
  cookie:{maxAge:1000*60*24*30},
  resave:false,
  saveUninitialized: true
}));

//使用路由index
app.use('/', indexRouter);

//使用路由users
app.use('/users', usersRouter);

// catch 404 and forward to error handler--处理404错误
app.use(function(req, res, next) {
  //next(createError(404));
  res.render('404');
});

// error handler--错误处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development--设置本地错误信息仅在开发环境中提供
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page--渲染错误请求页面
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3003, function() {
  console.log('listening port 3003');
});

module.exports = app;
