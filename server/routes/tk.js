var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var URL = require('url');
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
const request = require('request');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Mayh1132....',
	database: 'nodedb'
});
connection.connect();

router.get('/', function(req, res, next) {
	res.send('welcome to minitk');
})

router.get('/tj', function(req, res, next) {
	var params = URL.parse(req.url, true).query;
	var page = params.page ? parseInt(params.page) : 1;
	var limit = params.limit ? parseInt(params.limit) : 30;
	var start = (page - 1) * limit
	var sql = 'SELECT * FROM pic_pic_copy where pic_classify_id in (9,6,5,4,10,24,25)  limit ' + start + ' ,' + limit;
	connection.query(sql, function(err, result) {
		if (err) {
			console.log('[INSERT ERROR] - ', err.message);
			return;
		}
		res.header("Access-Control-Allow-Origin", "*");
		res.send(result);
	});
})
router.post('msg', function(req, res, next) {
	let content = req.body.content;
	let time = new Date().format('yyyy-MM-dd h:m:s');
	let ip = getClientIP(req);
	var sql = 'INSERT INTO pic_msg(content,ip,time) VALUES(?,?,?)';
	addSqlParams = [content, ip, time];
	connection.query(sql, addSqlParams, function(err, result) {
		if (err) {
			console.log('[INSERT ERROR] - ', err.message);
			res.send({
				code: -1,
				data: {},
				msg: '添加失败'
			});
			return;
		}
		res.send({
			code: 0,
			data: result,
			msg: '添加成功'
		});
	});
})


module.exports = router;