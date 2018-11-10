const connec  = require('./connection')
const connection = connec.connection;
const client = connec.client;
const request = require('request');
const AppID = "wxa450f03dfe3752e0";
const AppSecret = "8484911daaa2a7dba841b5b6f5b8cefc";
const crypto = require('crypto');


class User{

    constructor() {

    }
    addUser(user_token,userinfo,ip){
        return new Promise((resolve, reject)=>{
            let now  = new Date().format('yyyy-MM-dd h:m:s');
            let sql = 'insert into pic_user (user_nike,user_pic,user_sex,user_token,user_status,user_ip,user_created_at,user_logined_at) values (?,?,?,?,?,?,?,?)';
            let addSqlParams = [userinfo.nickName,userinfo.avatarUrl,userinfo.gender,user_token,1,ip,now,now]
            connection.query(sql,addSqlParams, function(err, result) {
                if (err || !result) {reject('');}
                var sql = 'select user_id from pic_user where user_token = ? limit 1';
                let addSqlParams = [user_token]
                connection.query(sql,addSqlParams, function(err, result2) {
                    if (err || !result2.length) {reject('');}
                    let user_id = result2[0].user_id;
                    let now  = new Date().format('yyyy-MM-dd h:m:s');
                    let msg_content = {
                        "title":'欢迎使用迷你图小程序',
                        "details":'欢迎使用小程序，小程序为您提供各类壁纸、化妆美妆、搭配街拍、流行头像等图文资讯，分享图片后即可下载图片，在各页面分享小程序累计达到20次后即可免费下载所有图片',
                        "content":'content'
                    };
                    msg_content = JSON.stringify(msg_content)
                    let sql = 'insert into pic_usermsg (msg_to_uid,msg_from_uid,msg_type,msg_content,msg_created_at,msg_status) values (?,?,?,?,?,?)';
                    let addSqlParams = [user_id,0,1,msg_content,now,0]
                    connection.query(sql,addSqlParams, function(err, result3) {
                        if (err) {reject('');return;}
                        resolve(user_token)
                    })
                })
            })
        })
    }

    selectUserId(user_token){
        return new Promise((resolve, reject)=>{
            var sql = 'select user_id from pic_user where user_token = ? limit 1';
            let addSqlParams = [user_token]
            connection.query(sql, function(err, result) {
                if (err || !result) {reject('');return;}
                let user_id = result[0].user_id;
                let now  = new Date().format('yyyy-MM-dd h:m:s');
                let msg_content = {
                    "title":'欢迎使用迷你图小程序',
                    "details":'欢迎使用小程序，欢迎使用小程序，欢迎使用小程序，欢迎使用小程序，欢迎使用小程序，欢迎使用小程序，欢迎使用小程序，欢迎使用小程序',
                    "content":'content'
                };
                let sql = 'insert into pic_usermsg (msg_to_uid,msg_from_uid,msg_type,msg_content,msg_created_at) values (?,?,?,?,?)';
                let addSqlParams = [user_id,0,1,msg_content.toJSONString(),now]
                connection.query(sql,addSqlParams, function(err, result) {
                    if (err) {reject('');return;}
                    resolve(user_token)
                })
            })

        })
    }

    updateUser(user_token,userinfo,ip){
        return new Promise((resolve, reject)=>{
            let now  = new Date().format('yyyy-MM-dd h:m:s');
            var sql = "update  pic_user set user_nike=?,user_pic=?,user_sex=?,user_logined_at=?,user_ip=? where user_token =?";
            let addSqlParams = [userinfo.nickName,userinfo.avatarUrl,userinfo.gender,now,ip,user_token]
            connection.query(sql,addSqlParams, function(err, result) {
                if (err || !result) {reject('');return;}
                resolve(user_token)
            })
        })
    }

    selectHasUser(user_token){
        return new Promise((resolve, reject)=>{
            var sql = "select user_id from pic_user where user_token = '"+user_token+"' limit 1";
            connection.query(sql, function(err, result) {
                if (err) {return reject('')}
                if(result.length){
                    return resolve(result[0].user_id);
                }else{
                    return resolve(false);
                }

            })
        })
    }

    selectUserInfo(user_id){
        return new Promise((resolve, reject)=>{
            var sql = "select * from " +
                "(select share_count from pic_user where user_id="+user_id+") as share_count," +
                "(select count(pic_comment.com_user_id) as mecomment_count from pic_comment where pic_comment.com_user_id="+user_id+" and pic_comment.com_deleted_at is null) as mecomment_count," +
                "(select count(pic_thumbs_up.up_user_id) as melike_count from pic_thumbs_up where pic_thumbs_up.up_user_id="+user_id+") as melike_count ";
            connection.query(sql, function(err, result) {
                if (err) {return reject('')}
                return resolve(result);
            })
        })
    }

    ckeckUserToken(token){
        return new Promise((resolve, reject)=>{
            client.get(token, function(error, res) {
                if(error) {
                    reject({code:-1,msg:'Token获取失败'});
                }
                if(res){
                    let tokenValue = res.split('ma.yh');
                    if(tokenValue.length!=2){
                        reject({code:-2,msg:'用户信息已过期，重新登录'});
                    }
                    //获取数据库中是否有用户信息
                    let usertoken = new Buffer(tokenValue[0]+'|mayh|').toString('base64');
                    var sql = "select user_id from pic_user where user_token = '"+usertoken+"' limit 1";
                    connection.query(sql, function(err, result) {
                        if (err || !result.length) {reject({code:-1,msg:'用户ID获取失败'});}else{
                            resolve(result[0].user_id);
                        }
                    })

                }else{
                    reject({code:-2,msg:'用户信息已过期，重新登录'});
                }
            });
        })
    }

    login(code){
        return new Promise((resolve, reject)=> {
            request.get({
                url: 'https://api.weixin.qq.com/sns/jscode2session?js_code=' + code + '&appid=' + AppID + '&secret=' + AppSecret + '&grant_type=authorization_code',
            }, function(err, res, body) {
                if (!err && res.statusCode == 200) {
                    body = JSON.parse(body);
                    if (body.errcode) {
                        reject({code:-1,msg:body});
                    } else {
                        let key = Date.now()+Math.random().toString();
                        var shasum = crypto.createHash('sha1');
                        shasum.update(key);
                        var openid = shasum.digest('hex');
                        var value = body.openid+'ma.yh'+body.session_key;
                        client.set(openid,value, function(error, res) {
                            if(error) {
                                reject({code:-1,msg:'登陆失败'});
                            }
                        });
                        client.expire(openid, body.expires_in);
                        resolve(openid)
                    }
                } else {
                    reject({code:-1,msg:'登陆失败'});
                }
            });
        })
    }

    updateshare(user_id){
        return new Promise((resolve, reject)=>{
            let now  = new Date().format('yyyy-MM-dd h:m:s');
            var sql = "update  pic_user set share_count=share_count+1 where user_id =?";
            let addSqlParams = [user_id]
            connection.query(sql,addSqlParams, function(err, result) {

                if (err || !result) {reject('');return;}
                resolve()
            })
        })
    }

    selectOtherUserInfo(user_id){
        return new Promise((resolve, reject)=>{
            var sql = "select user_nike,user_pic,user_sex,share_count,"+
            "(select count(1) from pic_thumbs_up where up_user_id = pic_user.user_id) as up_count,"+
            "(select count(1) from pic_comment where com_user_id = pic_user.user_id) as com_count "+
            "from pic_user where user_id  = "+user_id +' limit 1';
            connection.query(sql, function(err, result) {
                if (err) {return reject('')}
                if(result.length){
                    return resolve(result[0]);
                }else{
                    return resolve([]);
                }

            })
        })
    }

    addTalk(user_id,content,contact){
        return new Promise((resolve, reject)=> {
            let now = new Date().format('yyyy-MM-dd h:m:s');
            let sql = 'insert into pic_talk (talk_user_id,talk_content,talk_contact,talk_pic,talk_created_at) values (?,?,?,?,?)';
            let addSqlParams = [user_id, content, contact, '', now]
            connection.query(sql, addSqlParams, function (err, result) {
                if (err) {
                    reject('');
                }
                resolve()
            })
        })
    }

    selectUserMsg(start,limit,user_id,is_read){
        return new Promise((resolve, reject)=>{
            if(is_read && start == 0){
                let now = new Date().format('yyyy-MM-dd h:m:s');
                var sql = 'update pic_usermsg set msg_status=1 where msg_to_uid=? and msg_created_at < ?';
                let addSqlParams = [user_id,now];
                connection.query(sql,addSqlParams, function(err, re) {
                    if (err) {reject(err);return;}
                    resolve()
                })
            }else{
                resolve()
            }
        }).then(function () {
            return new Promise((resolve, reject)=>{
                var sql = "select a.*,b.user_nike as msg_to_user_nike,b.user_pic as msg_to_user_pic,c.user_nike as msg_from_user_nike,c.user_pic as msg_from_user_pic from  pic_usermsg as a "+
                    "left join pic_user as b on b.user_id = a.msg_to_uid "+
                    "left join pic_user as c on c.user_id = a.msg_from_uid "+
                    "where msg_to_uid="+user_id+" order by msg_created_at desc  limit "+start+','+limit;
                connection.query(sql, function(err, result) {
                    if (err) {reject('');}
                    resolve(result);
                })
            })
        }).then(function (result) {
            return new Promise((resolve, reject)=>{
                var sql = 'select count(1) as count from pic_usermsg where msg_to_uid=?';
                let addSqlParams = [user_id];
                connection.query(sql,addSqlParams, function(err, re) {
                    if (err) {reject(err);return;}
                    resolve({list:result,count:re[0].count})
                })
            });
        }).then(function (result) {
            return new Promise((resolve, reject)=>{
                if(result.list.length < limit){result.hasMore = 0;resolve(result)}
                let msg_id = result.list[result.list.length-1].msg_id;
                var sql = 'SELECT * from pic_usermsg where msg_to_uid = ? and msg_id > ? order by msg_created_at desc limit 1';
                let addSqlParams = [user_id,msg_id]
                connection.query(sql,addSqlParams, function(err, re) {
                    if (err) {reject(err);return;}
                    if(re.length>0){
                        result.hasMore = 1;
                    }else{
                        result.hasMore = 0;
                    }
                    resolve(result)
                })
            });
        })
    }
}
module.exports = User;