var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const timeout = require('connect-timeout');
const proxy = require('http-proxy-middleware');

var app = express();


// 超时时间
const TIME_OUT = 30 * 1e3;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 设置超时 返回超时响应
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
	if (!req.timedout) next();
});

app.use(proxy('/api', {
	target: 'https://api.izuiyou.com',
	changeOrigin: true,
	pathRewrite: {
		'^/api': ''
	},
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));


var indexRouter = require('./routes/index');
app.use('/wx', indexRouter);


app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));


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

module.exports = app;