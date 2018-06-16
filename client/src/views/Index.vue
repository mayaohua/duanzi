<template>
  <div class="wrap">
    <div class="load-wrap">
      <mt-spinner v-show="!Object.keys(data).length && more" class="loading" type="double-bounce" color="rgb(38, 162, 255)"></mt-spinner>
      <p v-show="!more">服务器连接失败，请稍候重试</p>
    </div>
    <div v-show="Object.keys(data).length">
      <ul id="scrollWrap" ref="scroll-wrap" v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="20">
        <li v-for="item in data.list">
          <p v-if="item.content">{{ item.content }}</p>
          <div class="img-box" v-if="item.imgs" >
              <div v-for="img in getImgsPath(item.imgs)" :style="{width:item.imgs.length==1?'100%':item.imgs.length==2?'50%':'33.3%'}">
                <div >
                  <img @click="showPicPopup(img,item)" :style="changeImgW(item.imgs)" :src="img.pathimg">
                  <span v-show="img.fmt == 'gif'" class="gifImg typeImg"></span>
                  <span v-show="img.video == 1" class="mp4Img typeImg"></span>
                </div>
              </div>
          </div>
          <div class="evaluate" v-if="item.god_reviews instanceof Array">
              <mt-badge type="error">神</mt-badge>
              <p v-html="item.god_reviews[0].review"></p>
              <div v-if="item.god_reviews[0].audio" style="padding:10px 0;border:1px solid red;"></div>
              <!-- <p v-text="item.god_reviews.length"></p> -->
          </div>
        </li>
      </ul>
      <div style="padding-bottom:5px;"  v-show="loading && more">
        <mt-spinner color="rgb(38, 162, 255)" style="text-align: center;" type="triple-bounce"></mt-spinner>
      </div>
    </div>
    <!-- 图片展示 -->
    <PicPopup :obj="picPopup" @closePicPopup="picPopup.show = false"/>
  </div>
</template>
<script>
import PicPopup from '../components/PicPopup'
export default {
  name: 'Index'
  ,components:{
    PicPopup
  }
  ,data (){
    return {
      picPopup:{
          show:false,
          path : '',
          type:'img',
      },
      loading:false,
      more:true,
      data : {},
      baseimgpath:'https://file.izuiyou.com/img/view/',
      requestdata:{
        //  ctn:20
        // ,direction:"up"
        // ,filter:"imgtxt"
        // ,h_av:"3.0"
        // ,h_ch:"web_app"
        // ,h_dt:9
        // ,h_nt:9
        // ,offset:0
        // ,tab:"rec"
        // ,ua:"Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
      }
    }
  }
  ,methods:{
    getDataList(){
      //判断本地是否有资源
      // if(window.sessionStorage.datalist){
      //   this.data = JSON.parse(window.sessionStorage.datalist);return ;
      // }
      //http://api.izuiyou.com/topic/recommend_home?sign=20df9e01ed74f53535a91347a510680e
      if(!this.more){
        return;
      }
      let url = '/api/index/webrecommend';
      let vue = this;
      this.$axios.post(url,this.requestdata)
      .then(function(response) {
        if(response.data.ret == 1){
          //console.log(response.data.data);
          if(vue.data.list){
            if(response.data.data.more == 0){
              vue.more = false;
              vue.loading = false;
              vue.$toast({
                message: '到底啦^_^',
                position: 'bottom'
              });
              return ;
            }
            vue.data.list = vue.data.list.concat(response.data.data.list)
            vue.data.offset = response.data.data.offset;
          }else{
            vue.data = response.data.data;
          }
          vue.requestdata.offset = vue.data.offset;
          //window.sessionStorage.datalist = JSON.stringify(vue.data);
        }else{
          vue.$toast({
                message: '获取数据失败',
                position: 'top'
          });
          vue.more = false;
        }
        vue.loading = false;
      }).catch((error)=>{
          vue.more = false;
      });
    }
    ,getImgsPath(imgArr){
      var showW = document.body.clientWidth;
      var vue = this;
      var sz = 0;
      var marginx = 0;
      if(imgArr.length==1){
          sz = 480;
          marginx = 0;
      }else if(imgArr.length>=2){
        sz = 148;
        marginx = 0;
      }
      if(imgArr.length){
        imgArr.map((i)=>{
          i.pathimg = vue.baseimgpath+'id/'+i.id+'/sz/'+sz
          i.marginx = marginx;
        });
      }
      return imgArr;
    }
    ,changeImgW(imgs){
      let w=document.body.offsetWidth - 10;
      if(imgs.length==1){
        return {minWidth:w+'px'};
      }else{
        return {}
      }
    }
    ,loadMore() {
      this.loading = true;
      let vue = this;
      setTimeout(()=>{
        vue.getDataList();
      },3000)
      
    },
    showPicPopup(img,item){
      this.picPopup.path = this.baseimgpath+'id/'+img.id;
      this.picPopup.show = true;
      if(img.video == 1){
        this.picPopup.type = "video";
      }else{
        this.picPopup.type = "img";
      }
      
    }
  }
  ,created:function(){
   // this.getDataList();
  },
  //   解除keep-alive的缓存
  beforeRouteEnter: (to, from, next) => {
    next(vm=>{
       document.getElementsByClassName('wrap')[0].scrollTop = to.meta.savedPosition;
    });
  },
  //  路由离开时清除onscroll事件
  beforeRouteLeave: (to, from, next) => {
     var scrollTop = document.getElementsByClassName('wrap')[0].scrollTop;
     from.meta.savedPosition = scrollTop;
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin:0;
    padding:0;
  }
  .load-wrap{
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
    display: flex;
    justify-content:center;
    align-items:center;
    z-index: -1;
  }
   ul{
    background-color: #eff0f7;
    position: relative;
   }
  ul li{
    background: #fff;
    border-top:1px solid #eee;
    margin-bottom: 10px;
    padding:0 5px;
    border-bottom:1px solid white;
  }
  ul li p{
    font-size: 16px;
    color: #333;
    line-height: 1.5;
    margin: 12px 0;
  }
  ul li .img-box{
    overflow: hidden;
  }
  ul li .img-box div{
    float: left;
  }
  ul li .img-box div div{
    margin:3px;

  }
  ul li .img-box div{
    position: relative;
  }
  ul li .img-box div img{
    width: 100%;
    height: 100%;
    display: block;
  }
  ul li .img-box div .typeImg{
    position: absolute;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: 38px;
    height: 38px;
    left:0;
    top: 0;
    bottom: 0;
    right: 0;
    display: block;
    margin: auto;
  }
  ul li .img-box div .gifImg{
    background: url(/static/img/gif.png) no-repeat 50%;
  }
ul li .img-box div .mp4Img{
    background: url(/static/img/mp4.png) no-repeat 50%;
  }
  ul li .evaluate{
    background-color:#eee;
    margin:5px;
    padding:12px 20px;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
  }
  .evaluate .mint-badge{
    position: absolute;
    top: -4px;
    left: -6px;
    font-weight: normal;
    font-size: 12px;
  }
  ul li .evaluate p{
        font-size: 14px;
      color: #242529;
      line-height: 20px;
      margin: 12px 0;
  }


</style>
