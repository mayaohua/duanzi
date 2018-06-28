var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
	res.send('welcome api');
});


var formRouter = require('./users');
app.use('/user', formRouter);

module.exports = app;