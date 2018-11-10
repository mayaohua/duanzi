const connec  = require('./connection')
const connection = connec.connection;
const async = require('async');

class Pic{
    constructor() {

    }
    thumbs_up(user_id,up_pic_id){
        return new Promise(function (resolve, reject) {
            let sql = "select up_id from pic_thumbs_up where up_user_id = "+user_id+" and up_pic_id = " + up_pic_id+" limit 1";
            connection.query(sql, function(err, result) {
                if (err) {reject({code:-1,msg:'点赞失败'});}
                resolve(result)
            })
        }).then(function (result) {
            return new Promise(function (resolve, reject) {
                if(result.length){
                    let sql = "delete from pic_thumbs_up where up_user_id = "+user_id+" and up_pic_id = " + up_pic_id;
                    connection.query(sql, function(err, result) {
                        if (err) {reject({code:-1,msg:'点赞失败'});}
                        resolve('s')
                    })
                }else{
                    let now  = new Date().format('yyyy-MM-dd h:m:s');
                    let sql = "insert into pic_thumbs_up (up_pic_id,up_user_id,up_created_at) values ("+up_pic_id+","+user_id+",'"+now+"')"
                    connection.query(sql, function(err, result) {
                        if (err) {reject({code:-1,msg:'点赞失败'});}
                        resolve('a')
                    })
                }
            })
        })
    }
    selectTj(start,limit,user_id,cid){
        user_id = user_id || false;
        let query = cid ? ' where f.classify_id='+cid : '  ';
        let melike = user_id ? ',(select count(1) from pic_thumbs_up as e where e.up_pic_id = a.pic_id) as melike ':'';
        let orderby = cid?' ORDER BY a.pic_add_time desc ':' JOIN (SELECT floor(RAND() * (SELECT MAX(pic_id) FROM pic_pic_copy)) AS cooo) AS g WHERE a.pic_id >= g.cooo ';
        return new Promise(function (resolve, reject) {
            let page = start / limit + 1;
            if(!cid && page > 5){
                resolve([]);
            }
            let sql = 'select *,' +
                '(select count(1) from pic_thumbs_up as c where c.up_pic_id = a.pic_id) as up_count,' +
                '(select count(1) from pic_comment as d where d.com_pic_id = a.pic_id and com_deleted_at is null) as comment_count ' + melike+
                'from pic_pic_copy as a ' +
                'LEFT JOIN pic_classify as f on f.classify_id = a.pic_classify_id '+ query + orderby+
                'LIMIT ' + start + ' ,' + limit;
            connection.query(sql, function(err, result) {
                if (err) {reject('');}
                resolve(result)
            });
        })
    }
    selectMeUp (pic_ids,user_id){
        return new Promise((resolve, reject) => {
            let sql = "select up_user_id,up_pic_id  from pic_thumbs_up where up_pic_id in( "+pic_ids+") and up_user_id = "+user_id;
            connection.query(sql, function (err, rest) {
                if (err) {
                    reject({code:-1,msg:err});
                }
                resolve(rest);
            });
        })
    }

    getPicInfo(pic_id,user_id){
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT a.pic_id,a.pic_content,a.pic_photo,a.pic_add_time,a.pic_classify_id,a.pic_width,a.pic_height,a.pic_urls,d.classify_name from pic_pic_copy as a LEFT JOIN  pic_classify as d on a.pic_classify_id=d.classify_id  where a.pic_id = '+pic_id+'  limit 1';
            connection.query(sql, function(err, result) {
                console.log(pic_id);
                if(err || !result.length){reject(err)};
                result[0]['me_thumbs_up'] = 0;
                resolve(result[0])
            });
        }).then(function (result) {//查询点赞数
            return new Promise(function (resolve, reject) {
                var sql = "select count(*) as up_count from pic_thumbs_up where up_pic_id = " + pic_id;
                connection.query(sql, function (err, rest) {
                    if (err) {reject(err);return;}
                    result['up_count'] = rest[0].up_count;
                    resolve(result)
                });
            })
        }).then(function (result) {//查询评论数
            return new Promise(function (resolve, reject) {
                var sql = "select count(*) as comment_count from pic_comment where  com_pic_id = " + pic_id +" and com_deleted_at is null";
                connection.query(sql, function (err, rest) {
                    if (err) {reject(err);return;}
                    result['comment_count'] = rest[0].comment_count;
                    resolve(result)
                });
            })
        }).then(function (result) {//查询喜欢
            return new Promise(function (resolve, reject) {
                var sql = "select count(*) as count from pic_thumbs_up where up_user_id = "+user_id+" and up_pic_id = " + pic_id;
                connection.query(sql, function (err, rest) {
                    if (err) {reject(err);return;}
                    result['me_thumbs_up'] = rest[0].count;
                    resolve(result)
                });
            })
        })
    }
    selectMeLikeList(start,limit,user_id){
        return new Promise(function (resolve, reject) {
            let sql = 'select *,' +
                '(select count(1) from pic_thumbs_up as c where c.up_pic_id = a.up_pic_id) as up_count,' +
                '(select count(1) from pic_comment as d where d.com_pic_id = a.up_pic_id) as comment_count ' +
                'from pic_thumbs_up as a ' +
                'JOIN pic_pic_copy as b on b.pic_id = a.up_pic_id ' +
                'LEFT JOIN pic_classify as f on f.classify_id = b.pic_classify_id '+
                'where a.up_user_id = '+user_id+' ORDER BY a.up_created_at desc LIMIT ' + start + ' ,' + limit;
            connection.query(sql, function(err, result) {
                if (err) {reject({code:-1,msg:err});}
                resolve(result)
            });
        })
    }

}
module.exports = Pic;