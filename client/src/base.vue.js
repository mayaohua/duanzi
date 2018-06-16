exports.install = function (Vue, options) {
    //获取浏览器的高度
    Vue.prototype.getClientHeight = function(){
        var clientHeight=0;
        if(document.body.clientHeight&&document.documentElement.clientHeight)
        {
        var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
        }
        else
        {
        var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
        }
        return clientHeight;
    };
};