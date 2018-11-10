var express = require('express');
var router = express.Router();
var URL = require('url');

const request = require('request');
const connec  = require('./minitk/connection');
const UserAction = require('./minitk/user');
const PicAction =  require('./minitk/pic');
const ComAction =  require('./minitk/comment');
const allFun = require('../public/fun/tk');
Date.prototype.format = allFun.timetrans;

const connection = connec.connection;

const client = connec.client;

router.get('/', function(req, res, next) {
	res.send('welcome to minitk');
})

router.post('/msg', function(req, res, next) {
	let content = req.body.content;
	let time = new Date().format('yyyy-MM-dd h:m:s');
	let ip = allFun.getClientIP(req);
	var sql = 'INSERT INTO pic_msg(content,ip,time) VALUES(?,?,?)';
	addSqlParams = [content, ip, time];
	connection.query(sql, addSqlParams, function(err, result) {
		if (err) {
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

router.get('/case', (req, res, next) => {
	var sql = 'select * from pic_classify';
	connection.query(sql, function(err, result) {
		if (err) {
			res.send({
				code: -1,
				data: {},
				msg: '获取失败'
			});
			return;
		}
		res.send({
			code: 0,
			data: result,
			msg: '获取成功'
		});
	});
});

router.get('/showimg', (req, resn, next) => {
	var params = URL.parse(req.url, true).query;
	var url = params.url || '';
	var data = '';
	request.get({
		url: url,
		encoding: null
	}, function(err, res, body) {
		resn.writeHead(200, {
			"Content-Type": res.headers['content-type'],
            "Content-Length": res.headers['content-length'],
		});
		if (!err && res.statusCode == 200) {
			resn.write(body, "binary");
			resn.end();
		} else {
			resn.end();
		}
	});
});

router.get('/login', (req, resn, next) => {
	var params = URL.parse(req.url, true).query;
	var code = params.code || false;
	if (!code) {
        resn.send({
			code: -1,
			data: {},
			msg: 'code参数不能为空'
		});
        resn.end();
	}
    new UserAction().login(code).then(resule=>{
        resn.send({
            code: 0,
            data: {user_token:resule},
            msg: '登录成功'
        });
        resn.end();
    }).catch(error=>{
        resn.send({
            code: -1,
            data: error,
            msg: '登录失败'
        });
        resn.end();
    })
});

router.post('/user', (req, resn, next) => {
    let user_token = req.body.user_token || null;
	let userInfo = req.body.userInfo || null;
	if (!userInfo || !user_token) {
		resn.send({
			code: -1,
			data: {},
			msg: '参数不合法'
		});
		resn.end();
	}
	client.get(user_token, function(error, res) {
		if(error) {
            resn.send({
                code: -2,
                data: {},
                msg: '用户信息已过期，重新登录'
            });
		}
		if(res){
            let tokenValue = res.split('ma.yh');
            if(tokenValue.length!=2){
                resn.send({
                    code: -2,
                    data: {},
                    msg: '用户信息已过期，重新登录'
                });
            }
            //获取数据库中是否有用户信息
            let usertoken = new Buffer(tokenValue[0]+'|mayh|').toString('base64');
            let user = new UserAction();
            let user_ip = allFun.getClientIP(req) || '';
            return user.selectHasUser(usertoken).then((user_id)=>{
                return new Promise((resolve,reject)=>{
                    if(user_id == false){
                        console.log('addyonghu +++++++')
                        user.addUser(usertoken,userInfo,user_ip).then(user.selectUserInfo(user_id).then(resu=>{
                            resolve(resu[0]);
                        }).catch(error=>{
                            reject(error)
                        }))
                    }else{
                         user.updateUser(usertoken,userInfo,user_ip).then(user.selectUserInfo(user_id).then(resu=>{
                             resolve(resu[0]);
                         }).catch(error=>{
                             reject(error)
                         }))
                    }
                }).then(res=>{
                    resn.send({
                        code: '0',
                        data: res,
                        msg: '更新用户成功'
                    });
                }).catch(error=>{
                    resn.send({
                        code: '－1',
                        data: error,
                        msg: '更新用户失败'
                    });
                })
            }).catch(error=>{
                resn.send({
                    code: '－1',
                    data: error,
                    msg: '更新用户失败'
                });
            })
		}else{
            resn.send({
                code: -2,
                data: {},
                msg: '用户信息已过期，重新登录'
            });
        }
		resn.end();
	});
});

router.get('/info',allFun.tokenCheck, (req, res, next) => {
    var params = URL.parse(req.url, true).query;
    var pic_id = params.id || false;
    if (!pic_id) {
        res.send({
            code: -1,
            data: {},
            msg: 'ID不能为空'
        });
        res.end();
    }
    new PicAction().getPicInfo(pic_id,req.user_id).then(result=>{
        res.send({
            code: 0,
            data: result,
            msg: '获取成功'
        });
        res.end();
    }).catch(error=>{
        res.send({
            code: -1,
            data: {},
            msg: '获取失败'
        });
        res.end();
    })
});

router.get('/commentlist/:pic_id',allFun.tokenCheck, (req, res, next) => {
    var params = URL.parse(req.url, true).query;
    var page = params.page ? parseInt(params.page) : 1;
    var pic_id = req.params.pic_id;
    var limit = params.limit ? parseInt(params.limit) : 30;
    var start = (page - 1) * limit;
    var user_id = req.user_id;
    var dess  = params.des || 'desc'
    var esc = false;
    new ComAction().commentByPicId(pic_id,start,limit).then(result=>{
        return new ComAction().getCommentPidInfo(result,user_id)
    }).then(result=>{
        return new Promise(resolve => {
            if(dess =='desc'){
                esc = false;
            }else{
                esc = true;
            }
            let res = result.sort(allFun.sortBy('com_created_at',esc));
            resolve(res)
        })
    }).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'获取成功'
        })
        res.end();
    }).catch(function(error){
        res.send({
            code: -1,
            data: error,
            msg: '获取失败'
        });
        res.end();
    });
});

router.get('/tj',allFun.tokenCheckList, function(req, res, next) {
    var params = URL.parse(req.url, true).query;
    var page = params.page ? parseInt(params.page) : 1;
    var limit = params.limit ? parseInt(params.limit) : 30;
    var start = (page - 1) * limit
    //查询数据
    let picaction = new PicAction();
    let user_id = req.user_id;
    picaction.selectTj(start,limit,user_id).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'获取成功'
        })
        res.end();
    }).catch(function(error){
        if(error.code == 0){
            res.send({
                code:0,
                data:[],
                msg:'获取成功'
            })
        }else{
            res.send({
                code: -1,
                data: '',
                msg: '获取失败'
            });
        }
        res.end();
    });
});


router.get('/me_thumbs_up',allFun.tokenCheck, (req, resn, next) => {
    return new Promise(function (resolve, reject) {
        var params = URL.parse(req.url, true).query;
        var pic_id = params.id || false;
        var user_id = req.user_id;
        if(!pic_id){reject({code:-1,msg:'ID不能为空'})}
        new PicAction().thumbs_up(user_id,pic_id).then(resule=>{
            resolve(resule)
        }).catch(error=>{
            reject(error);
        })
    }).then(function (res) {
        resn.send({
            code: 0,
            data: res,
            msg: '操作成功'
        });
        resn.end();
    }).catch(error=>{
        resn.send({
            code: -1,
            data: '',
            msg: error.msg
        });
        resn.end();

    })
});


router.get('/caselist/:cid',allFun.tokenCheckList, function(req, res, next) {
    var params = URL.parse(req.url, true).query;
    var cid = req.params.cid;
    var page = params.page ? parseInt(params.page) : 1;
    var limit = params.limit ? parseInt(params.limit) : 30;
    var start = (page - 1) * limit;
    //查询数据
    let picaction = new PicAction();
    let user_id = req.user_id;
    picaction.selectTj(start,limit,user_id,cid).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'获取成功'
        })
        res.end();
    }).catch(function(error){
        if(error.code == 0){
            res.send({
                code:0,
                data:[],
                msg:'获取成功'
            })
        }else{
            res.send({
                code: -1,
                data: '',
                msg: '获取失败'
            });
        }
        res.end();
    });
});

router.get('/comment_by_pid/:pid', (req, res, next) => {
    let pid = req.params.pid || false;
    if (!pid) {
        res.send({
            code: -1,
            data: {},
            msg: 'ID不能为空'
        });
        res.end();
    }
    Promise.all([new ComAction().commentByPid(0,[])])
        .then(data=>{
            res.send({
                code: 0,
                data: data,
                msg: '获取成功'
            });
            res.end();
        }).catch(error=>{
        res.send({
            code: -1,
            data: error,
            msg: '获取失败'
        });
        res.end();
    })
});

router.post('/addcomment',allFun.tokenCheck, (req, res, next) => {
    let pid = req.body.pid || null;
    let pic_id = req.body.pic_id || null;
    let content = req.body.content;
    let user_id = req.user_id;
    //content = allFun.urlencode(content);
    new ComAction().addcomment(pic_id,content,user_id,pid).then(resule=>{
        res.send({
            code: 0,
            data: '',
            msg: '发布评论成功'
        });
        res.end();
    }).catch(error=>{
        res.send({
            code: -1,
            data: '',
            msg: error.msg
        });
        res.end();
    })

});

router.post('/share',allFun.tokenCheck, (req, res, next) => {
    let user_id = req.user_id;
    new UserAction().updateshare(user_id).then(resule=>{
        res.send({
            code: 0,
            data: '',
            msg: '转发成功'
        });
        res.end();
    }).catch(error=>{
        res.send({
            code: -1,
            data: error,
            msg: '转发失败'
        });
        res.end();
    })

});

router.post('/meshare',allFun.tokenCheck, (req, res, next) => {
    let user_id = req.user_id;
    new UserAction().updateshare(user_id).then(resule=>{
        res.send({
            code: 0,
            data: '',
            msg: '转发成功'
        });
        res.end();
    }).catch(error=>{
        res.send({
            code: -1,
            data: error,
            msg: '转发失败'
        });
        res.end();
    })

});

router.get('/mecomment',allFun.tokenCheck, (req, res, next) => {
    let user_id = req.user_id;
    var params = URL.parse(req.url, true).query;
    var page = params.page ? parseInt(params.page) : 1;
    var limit = params.limit ? parseInt(params.limit) : 30;
    var orderby =  params.desc ? parseInt(params.desc) : 1;
    var start = (page - 1) * limit;
    new ComAction().selectMecomment(user_id,start,limit,orderby).then((resule)=>{
        res.send({
            code: 0,
            data: resule,
            msg: '获取成功'
        });
        res.end();
    }).catch(error=>{
        res.send({
            code: -1,
            data: error,
            msg: '获取失败'
        });
        res.end();
    })
});

router.get('/melike',allFun.tokenCheck, function(req, res, next) {
    var params = URL.parse(req.url, true).query;
    var page = params.page ? parseInt(params.page) : 1;
    var limit = params.limit ? parseInt(params.limit) : 30;
    var start = (page - 1) * limit;
    //查询数据
    let picaction = new PicAction();
    let user_id = req.user_id;
    picaction.selectMeLikeList(start,limit,user_id).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'获取成功'
        })
        res.end();
    }).catch(function(error){
        res.send({
            code: -1,
            data: '',
            msg: '获取失败'
        });
        res.end();
    });
});

router.get('/usercenter',allFun.tokenCheck, function(req, res, next) {
    var params = URL.parse(req.url, true).query;
    var user_id = params.user_id;
    user_id = Number(user_id);
    if(user_id<=0){
        res.send({
            code: -1,
            data: '',
            msg: '参数有误'
        });
        res.end();
    }
    //查询数据
    new UserAction().selectOtherUserInfo(user_id).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'获取成功'
        })
        res.end();
    }).catch(function(error){
        res.send({
            code: -1,
            data: '',
            msg: '获取失败'
        });
        res.end();
    });
});

router.post('/usertalk',allFun.tokenCheck, function(req, res, next) {
    let user_id = req.user_id;
    let content = req.body.content;
    let contact = req.body.contact;
    //let pic = req.body.pic || null;

    new UserAction().addTalk(user_id,content,contact).then(result=>{
        res.send({
            code:0,
            data:'',
            msg:'提交成功'
        })
        res.end();
    }).catch(function(error){
        res.send({
            code: -1,
            data: '',
            msg: '提交失败'
        });
        res.end();
    });
});

router.get('/usermsg',allFun.tokenCheck, function(req, res, next) {
    let user_id = req.user_id;
    var params = URL.parse(req.url, true).query;
    var page = params.page ? parseInt(params.page) : 1;
    var limit = params.limit ? parseInt(params.limit) : 30;
    var start = (page - 1) * limit;
    var is_read = params.is_read ? parseInt(params.is_read) : false;
    new UserAction().selectUserMsg(start,limit,user_id,is_read).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'获取成功'
        })
        res.end();
    }).catch(function(error){
        res.send({
            code: -1,
            data: error,
            msg: '获取失败'
        });
        res.end();
    });
});

router.post('/delcomment/:id', function(req, res, next) {
    let user_id = 13;//req.user_id;
    var com_id = req.params.id || false;
    let delete_text = req.body.delete_text;
    if(!com_id || !delete_text.length){
        res.send({
            code: -1,
            data: error,
            msg: '缺少参数'
        });
        res.end();
    }
    new ComAction().delComment(com_id,delete_text).then(result=>{
        res.send({
            code:0,
            data:result,
            msg:'删除成功'
        })
        res.end();
    }).catch(function(error){
        res.send({
            code: -1,
            data: '',
            msg: error.msg
        });
        res.end();
    });
});

/*

const multer = require('multer');
let path = require("path");
//上传文件配置
const storage = multer.diskStorage({
    //文件存储位置
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../uploads/tk/'));
    },
    //文件名
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${Math.ceil(Math.random() * 1000)}_multer.${file.originalname.split('.').pop()}`);
    }
});
const uploadCfg = {
    storage: storage,
    limits: {
        //上传文件的大小限制,单位bytes
        fileSize: 1024 * 1024 * 20
    }
};

router.post('/uploadimg',allFun.tokenCheck, async (req, res) => {
    // let upload = multer(uploadCfg).any();
    // console.log(req.files);
    // // upload(req, res, async (err) => {
    // //     let uploadFile = req.files[0];
    // //     if (err) {
    // //         res.json({path: `//uploads/tk/${uploadFile.filename}`});
    // //         console.log(err);
    // //         return;
    // //     }
    // //     console.log(req.files);
    // //     let uploadFile = req.files[0];
    // //     res.json({path: `//uploads/tk/${uploadFile.filename}`});
    // // });
});*/

//,allFun.tokenCheck

module.exports = router;
