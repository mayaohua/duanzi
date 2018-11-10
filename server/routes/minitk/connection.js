var mysql = require('mysql');
var redis = require("redis");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mayh1111....',
    database: 'nodedb',
    dateStrings:true,
});

//module.exports =  connection;

var client = redis.createClient(6379,"127.0.0.1");
//连接错误处理
client.on("error", function (error) {
    console.log(error);
});
//redis验证 （如果redis没有开启验证，此配置可以不写）
client.auth("Mayh1111....");

client.select('0', function(error){
    if(error) {
        console.log(error);
        return false;
    }
});
connection.connect();
module.exports = {connection,client};