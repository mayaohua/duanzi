const connec  = require('./connection')
const connection = connec.connection;
const async = require('async');
const moment = require('moment');

class Comment {
    constructor() {
        moment.locale('zh-cn');
    }

    getCommentPidInfo(result,user_id){
        return new Promise(function (resolve, reject) {
            const stat = function (id) { // 确认是否是文件夹
                return new Promise((res, rej) => {
                    if(id == 0){
                        res();
                    }
                    var sql = 'select com_content,user_nike,user_pic,user_id from pic_comment left join pic_user on user_id = com_user_id where com_id ='+id+' limit 1';
                    connection.query(sql, function(err, resu) {
                        if (err) {
                            res();
                        }
                        res(resu[0]);
                    });
                })
            }
            let newresult = [];
            const getdirs = async function() {
                const promises = result.map(function(item){ // 利用map函数特性，返回值组成新的数组，这儿并没有用async函数，map内并不等待一个stat回来后再进行另一个stat，是同时进行的。
                    return stat(item.com_pid)
                        .then(res => {
                            item['isme'] = item.user_id == user_id ? 1 : 0;
                            item['com_created_date'] = moment(item['com_created_at']).format("YYYY年MM月DD日 HH:mm")
                            let temp = item;
                            res && (temp['pcom'] = res);
                            newresult.push(temp);
                        })
                })
                await Promise.all(promises)
                resolve(newresult)
            }
            getdirs();

        })

    }
    commentByPicId(pic_id,start,limit){
        return new Promise(function (resolve, reject) {
            let sql = 'select pic_comment.*,user_nike,user_pic,user_id from pic_comment left join pic_user on user_id = com_user_id where com_pic_id = '+pic_id+' and com_deleted_at is null order by com_created_at desc limit '+start+',100';
            connection.query(sql, function(err, result) {
                if (err) {
                    reject({code:-1,msg:err})
                }
                return resolve(result);
            });
        })
    }
    commentByPid(pid,arr){
        var that = this;
        let isBack = false;
        return new Promise(function (resolve, reject) {
            var sql = 'select pic_comment.*,user_nike from pic_comment left join pic_user on user_id = com_user_id where com_pid = '+pid+' and com_deleted_at is null order by com_created_at desc';
            connection.query(sql, function(err, result) {
                if (err) {
                    reject({code:-1,msg:err})
                }
                if(!result.length){isBack = true}
                async.forEachOf(result, (value, key, callback) => {
                    arr.push(value);
                    that.commentByPid(value.com_id,arr)
                    callback();
                }, err => {
                    if (err) console.error(err.message);
                });
            });
        })
    }
    addcomment(pic_id,content,user_id,pid){
        let that = this;
        return new Promise(function (resolve, reject) {
            pid = pid || 0;
            let now  = moment().format("YYYY-MM-DD HH:mm:ss");
            let sql = 'insert into pic_comment (com_pic_id,com_user_id,com_pid,com_content,com_created_at) values (?,?,?,?,?)';
            let addSqlParams = [pic_id,user_id,pid,content,now]
            connection.query(sql,addSqlParams, function(err, result) {
                if (err) {
                    reject({code: -1, msg: '评论失败，请稍后重试'})
                }
                if(pid!=0){
                    that.addMsgToUser(pid,content,user_id).then(function (result) {
                        resolve(result);
                    })

                }else{
                    resolve(result);
                }
            })
        })
    }
    addMsgToUser(com_id,from_user_comment,from_user_id){
        return new Promise(function (resolve, reject) {
            let sql = 'select pic_id,com_content,classify_name,pic_content,pic_urls,pic_photo,com_user_id from pic_comment left join pic_pic_copy on pic_id = com_pic_id left join pic_classify on classify_id = pic_classify_id where com_id = '+com_id+' and com_deleted_at is null limit 1';
            connection.query(sql, function(err, result) {
                if (err || !result.length) {
                    reject({code: -2, msg: '回复评论失败，回复评论不存在'})
                }
                resolve(result[0]);
            });
        }).then(function (result) {
            return new Promise(function (resolve, reject) {
                let now  = new Date().format('yyyy-MM-dd h:m:s');
                let msg_content = {
                    "from_user_comment":from_user_comment,
                    "pic_id":result.pic_id,
                    "pic_content":result.pic_content,
                    "pic_urls":result.pic_urls,
                    "pic_photo":result.pic_photo,
                    "case_name":result.classify_name,
                    "to_user_comment":result.com_content,
                };
                msg_content = JSON.stringify(msg_content)
                let sql = 'insert into pic_usermsg (msg_to_uid,msg_from_uid,msg_type,msg_content,msg_created_at,msg_status) values (?,?,?,?,?,?)';
                let addSqlParams = [result.com_user_id,from_user_id,2,msg_content,now,0]
                connection.query(sql,addSqlParams, function(err, result3) {
                    reject({code: -3, msg: '评论回复成功'})
                    resolve(result3)
                })
            })
        }).catch(function (error) {
            console.log(error);
        })
    }

    delComment(com_id,delete_text){
        return new Promise(function (resolve, reject) {
            let sql = 'update pic_comment set com_deleted_at = ? where com_id = ?';
            let now  =  new Date().format('yyyy-MM-dd h:m:s');
            let addSqlParams = [now,com_id]
            connection.query(sql,addSqlParams, function(err, result) {
                console.log(result)
                if (err) {
                    reject({code: -2, msg: '删除失败'})
                }
                resolve(com_id);
            });
        }).then(function (com_id) {
            return new Promise(function (resolve, reject) {
                let sql = 'select pic_id,com_content,classify_name,pic_content,pic_urls,pic_photo,com_user_id from pic_comment left join pic_pic_copy on pic_id = com_pic_id left join pic_classify on classify_id = pic_classify_id where com_id = '+com_id+' and com_deleted_at is not null limit 1';
                connection.query(sql, function(err, res) {
                    if (err || !res.length) {
                        reject({code: -3, msg: '删除评论失败，回复评论不存在'})
                    }
                    resolve(res[0]);
                });
            })
        }).then(function (result) {
            return new Promise(function (resolve, reject) {
                let now  = new Date().format('yyyy-MM-dd h:m:s');
                let msg_content = {
                    "delete_text":delete_text,
                    "pic_id":result.pic_id,
                    "pic_content":result.pic_content,
                    "pic_urls":result.pic_urls,
                    "pic_photo":result.pic_photo,
                    "case_name":result.classify_name,
                    "to_user_comment":result.com_content,
                };
                msg_content = JSON.stringify(msg_content)
                let sql = 'insert into pic_usermsg (msg_to_uid,msg_from_uid,msg_type,msg_content,msg_created_at,msg_status) values (?,?,?,?,?,?)';
                let addSqlParams = [result.com_user_id,0,3,msg_content,now,0];
                connection.query(sql,addSqlParams, function(err, result3) {
                    reject({code: -3, msg: '删除评论成功'})
                    resolve(result3)
                })
            })
        }).catch(function (error) {
            // console.log(error)
        })
    }

    selectMecomment(user_id,start,limit,desc){
        let orderby = desc?'desc':'asc';
        return new Promise((resolve, reject)=>{
            var sql = 'SELECT b.user_id,b.user_nike,b.user_pic,b.user_sex,' +
                'pic_id,pic_urls,pic_width,pic_photo,pic_height,pic_content,'+
                'a.com_content,a.com_created_at,a.com_id,' +
                'classify_id,classify_name,' +
                'c.com_content as p_com_content,c.com_created_at as p_com_created_at,c.com_deleted_at as p_com_deleted_at,' +
                'd.user_id as p_user_id,d.user_nike as p_user_nike,d.user_pic as p_user_pic,d.user_sex as p_user_sex ' +
                'from pic_comment as a ' +
                'left join pic_user as b on a.com_user_id = b.user_id ' +
                'left join pic_pic_copy on pic_id = a.com_pic_id ' +
                'left join pic_classify on classify_id = pic_classify_id  ' +
                'left join pic_comment as c  on a.com_id = c.com_pid ' +
                'left join pic_user as d  on d.user_id = c.com_user_id  ' +
                'where a.com_user_id = ? and a.com_deleted_at is null  order by a.com_created_at '+orderby+' limit ?,?';
            let addSqlParams = [user_id,start,limit]
            connection.query(sql,addSqlParams, function(err, result) {
                if (err) {reject(err);return;}
                resolve(result)
            })
        }).then(function (result) {
            return new Promise((resolve, reject)=>{
                var sql = 'select count(1) as count from pic_comment where com_user_id=? and com_deleted_at is null';
                let addSqlParams = [user_id];
                connection.query(sql,addSqlParams, function(err, re) {
                    if (err) {reject(err);return;}
                    resolve({list:result,count:re[0].count})
                })
            });
        }).then(function (result) {
            return new Promise((resolve, reject)=>{
                if(result.list.length < limit){result.hasMore = 0;resolve(result)}
                let com_id = result.list[result.list.length-1].com_id;
                var sql = 'SELECT * from pic_comment where com_user_id = ? and com_id > ? order by com_created_at '+orderby+' limit 1';
                let addSqlParams = [user_id,com_id]
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


module.exports = Comment;