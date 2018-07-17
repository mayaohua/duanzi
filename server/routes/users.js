var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const request = require('request');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Mayh1132....',
	database: 'nodedb'
});
connection.connect();

router.get('/', function(req, res, next) {
	request.get({
			url: 'https://www.duitang.com/napi/index/groups/?app_version=14',
			form: {
				// username: 'hahaha',
				// password: 'wowowowow'
			},
			encoding: 'utf8'
		},
		function(error, response, body) {
			if (response.statusCode == 200) {
				var addSql = 'INSERT INTO pic_classify(classify_name,classify_icon_url,classify_pid) VALUES(?,?)';
				var jsonObj = JSON.parse(body);
				var data = jsonObj.data[0].group_items;
				//res.send(data)
				data.forEach(function(value) {
					connection.query(addSql, [value.name, value.icon_url, value.icon_url], function(error, result) {
						if (error) {
							console.log('error');
						}
					})
				});
				res.send('respond with a resource');
			}


			// var sql = 'SELECT * FROM user';
			// router.get('/all', function(req, res, next) {
			// 	connection.query(sql, function(err, result) {
			// 		if (err) {
			// 			console.log('查询失败 ', err.message);
			// 			return;
			// 		}
			// 		res.json(result)
			// 		//res.send('respond with a resource');
			// 		//return res.send(res);
			// 	})
			// })
		}
	);
})

// //SQL语句
// var sql = 'SELECT * FROM name';
// var addSql = 'INSERT INTO name(id,name,sex) VALUES(?,?,?)';

// router.get('/', function(req, res, next) {
// 	//解析请求参数
// 	var params = URL.parse(req.url, true).query;
// 	var addSqlParams = [params.id, params.name, params.sex];

// 	//增
// 	connection.query(addSql, addSqlParams, function(err, result) {
// 		if (err) {
// 			console.log('[INSERT ERROR] - ', err.message);
// 			return;
// 		}
// 	})
// });
// module.exports = router;

module.exports = router;