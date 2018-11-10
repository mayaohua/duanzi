const UserAction = require('../../routes/minitk/user');
exports.tokenCheck = function (req, resn, next) {
    let token = req.headers.authorization;
    let user = new UserAction();
    user.ckeckUserToken(token).then(function (user_id) {
        req.user_id = user_id;
        next();
    }).catch((error)=>{
        resn.send({
            code: error.code,
            data: 'fail',
            msg: error.msg
        });
        resn.end();
    })
}
//推荐所用
exports.tokenCheckList = function (req, resn, next) {
    let token = req.headers.authorization;
    if(token == undefined){
        next();
    }else{
        let user = new UserAction();
        user.ckeckUserToken(token).then(function (user_id) {
            req.user_id = user_id;
            next();
        }).catch((error)=>{
            req.user_id = false;
            next();
        })
    }

}
exports.timetrans  = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

exports.getClientIP  = function (req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};
/**数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
exports.sortBy = function(attr,rev){
    //第二个参数没有传递 默认升序排列
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }

    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}

exports.urlencode=function(clearString)
{
    var output = '';
    var x = 0;

    clearString = utf16to8(clearString.toString());
    var regex = /(^[a-zA-Z0-9-_.]*)/;

    while (x < clearString.length)
    {
        var match = regex.exec(clearString.substr(x));
        if (match != null && match.length > 1 && match[1] != '')
        {
            output += match[1];
            x += match[1].length;
        }
        else
        {
            if (clearString[x] == ' ')
                output += '+';
            else
            {
                var charCode = clearString.charCodeAt(x);
                var hexVal = charCode.toString(16);
                output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
            }
            x++;
        }
    }

    function utf16to8(str)
    {
        var out, i, len, c;

        out = "";
        len = str.length;
        for(i = 0; i < len; i++)
        {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F))
            {
                out += str.charAt(i);
            }
            else if (c > 0x07FF)
            {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
            else
            {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    return output;
}