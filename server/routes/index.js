var express = require('express');
var app = express();
var tkRouter = require('./tk');
// const UserAction = require('./minitk/user');

app.get('/', function(req, res, next) {
	res.send('welcome api');
});


/*app.use('/tk',function (req, resn, next) {
    var url = req.originalUrl.split('?')[0];
    let routes = ['/info','/commentlist','/me_thumbs_up'];
    for (let i = 0; i<routes.length;i++){
    	let item = routes[i];
        if(url == '/wx/tk'+item){
            let token = req.headers.authorization;
            let user = new UserAction();
            user.ckeckUserToken(token).then(function (user_id) {
                req.user_id = user_id;
            }).catch((error)=>{
                  resn.send({
                    code: error.code,
                    data: '',
                    msg: error.msg
                });
                resn.end();
            })
        }
    }
    next();
});*/

app.use('/tk', tkRouter);

//
// app.use('/user', formRouter);

module.exports = app;