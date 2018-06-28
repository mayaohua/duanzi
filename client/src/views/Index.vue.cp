<template>
  <div>
    <MyScroll ref="scroll" class="wrapper wrap"
   :data="data"
   :loadingStatus="loadingStatus" 
   :loadingMore="loadingMore"
   :pulldown="pulldown" 
   @scrollToStart="loadTop()" 
   :pullup="pullup"  
   @scrollToEnd="loadMore()">
    <!-- <mt-loadmore :top-method="loadTop" ref="loadmore"> -->
    <div class="box">
          <div v-show="Object.keys(data).length">
                <ul id="scrollWrap" ref="scroll-wrap" >
                <li v-for="item in data.list">
                  <p v-if="item.content">{{ item.content }}</p>
                  <div class="img-box" v-if="item.imgs" >
                      <div v-for="img in getImgsPath(item.imgs)" :style="{width:item.imgs.length==1?'100%':item.imgs.length==2?'50%':'33.3%'}" @click="showPicPopup(img,item)">
                        <div>
                          <!-- v-lazy.scrollWrap="img.pathimg" -->
                          <img  :style="changeImgW(item.imgs)" :src="img.pathimg">
                          <span v-show="img.fmt == 'gif'" class="gifImg typeImg"></span>
                          <span v-show="img.video == 1" class="mp4Img typeImg"></span>
                        </div>
                      </div>
                  </div>
                  <!-- 神评 -->
                  <div class="evaluate" v-if="item.god_reviews instanceof Array">
                      <mt-badge type="error">神</mt-badge>
                      <!-- <p v-html="item.god_reviews[0].review"></p> -->
                      <!-- 语音 -->
                      <div v-if="item.god_reviews[0].audio">
                        <Audio :data="item.god_reviews[0].audio"></Audio>
                      </div>
                      <!-- <div v-if="item.god_reviews[0].audio" style="padding:10px 0;">
                        <div style="width: 150px;height: 30px;border-radius: 4px;background: linear-gradient(to right, #2dcdff , #149eff);padding: 0 10px;line-height: 30px;" @click="audioPlay(item.god_reviews[0].audio)">
                          <img :src="'/static/img/audio_'+(audio.audio_palying && audio.audio_file == item.god_reviews[0].audio.url?'off':'on')+'.png'" width="9" height="11">
                          <img src="/static/img/audio_line.png" width="9" height="11" style="margin-left: 5px;">
                          <span style="float: right;color: white;">{{
                            (audio.audio_file == item.god_reviews[0].audio.url)?audio.time:item.god_reviews[0].audio.dur
                          }}s</span>
                        </div>
                      </div> -->
                  </div>
                </li>
              </ul>
          </div>
    </div>
  </MyScroll>
  <!-- 图片展示 -->
  <PicPopup :obj="picPopup" @closePicPopup="picPopup.show = false"/>
  </div>
</template>
<script>
import PicPopup from '../components/PicPopup'
import MyScroll from '../components/MyScroll'
import Audio from '../components/Audio'

export default {
  name: 'Index'
  ,components:{
    PicPopup,
    MyScroll,
    Audio
  }
  ,data (){
    return {
      pulldown: true,
      pullup: true,
      picPopup:{
          show:false,
          path : {
            img:'',
            video:'',
          },
          type:'img',
      },
      audio:{
        audio_palying : false,
        audio_file : '',
        obj : {},
        time : 0,
      },
      //重新加载
      loadingStatus : {
          isShow:true,
          showIcon:true,
          status:'',
        },
      //加载更多
      loadingMore : false,
      //没有了
      more:true,
      data : {},
      baseurl : "/api/index/webrecommend",//  /api/topic/posts_list
      baseimgpath:'https://file.izuiyou.com/img/view/',
      requestdata:
      {
         ctn:20
        ,direction:"up"
        ,filter:"imgtxt"
        ,h_av:"3.0"
        ,h_ch:"web_app"
        ,h_dt:9
        ,h_nt:9
        ,offset:0
        ,tab:"rec"
        ,ua:"Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36"
      }
      // {
      //   "sort": "new",//hot
      //   "h_m": 69753545,
      //   "token": "TcK1NKHn5iSng4ZCsJ0DlRUMA3oPMNA8mEESo9j_HzF8FwzV4U5Hw76W4UyznX2Lq4-0u",
      //   "tid": 126160,//101743
      //   "next_cb": '',//"{\"offset\":20,\"next_list_cb\":\"{\\\"consumed_number\\\":20}\"}",
      // }
    }
  }
  ,methods:{
    // _initScroll(){
    //   if (!this.scroll) {
    //     this.scroll = new BScroll(this.$refs.scroll, {})
    //     this.scroll.on('touchend', (pos) => {
    //       // 下拉动作
    //       if (pos.y > 50) {
    //         console.log('出发');
    //       }
    //     })
    //   } else {
    //     this.scroll.refresh()
    //   }
    // },
    getDataList(callback){
      //判断本地是否有资源
      // if(window.sessionStorage.datalist){
      //   this.data = JSON.parse(window.sessionStorage.datalist);return ;
      // }
      //http://api.izuiyou.com/topic/recommend_home?sign=20df9e01ed74f53535a91347a510680e
      if(!this.more){
        return;
      }
      //http://api.izuiyou.com/topic/posts_list?sign=06705d363de84391271df7780dd0d56a
      //http://api.izuiyou.com
      //http://api.izuiyou.com/index/recommend?sign=df3bffc13b368aeb9b4c5ab3472c11b2
      let vue = this;
      this.$axios.post(this.baseurl,this.requestdata)
      .then(function(response) {
        if(response.data.ret == 1){
          if(vue.data.list){
            if(response.data.data.more == 0){
              vue.$toast({
                message: '到底啦^_^',
                position: 'bottom'
              });
              return ;
            }
            vue.data.list = vue.data.list.concat(response.data.data.list)
          }else{
            vue.data = response.data.data;
          }
          vue.requestdata.offset = vue.data.offset;
        }else{
          vue.$toast({
                message: '获取数据失败,请稍后重试',
                position: 'bottom'
          });
          console.log(error);
        }
        callback(response.data.ret);
      }).catch((error)=>{
          vue.more = false;
          console.log(error)
      });
    }
    ,getImgsPath(imgArr){
      var showW = document.body.clientWidth;
      var vue = this;
      var sz = 0;
      var marginx = 0;
      if(imgArr.length==1){
          sz = '480x270';
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
      this.pullup = false;
      this.loading = true;
      let vue = this;
      this.loadingMore = true;
      setTimeout(()=>{
        vue.getDataList((code)=>{
          vue.loadingMore = false;
          vue.pullup = true;
        });
      },3000)
    },
    loadTop() {
        this.pulldown = false;
        // 加载更多数据
        this.loadingStatus = {
          isShow:true,
          showIcon:true,
          status:'',
        };
        setTimeout(()=>{
          this.data = {};
          this.getDataList((code)=>{
              this.loadingStatus = {
                isShow:true,
                showIcon:false,
                status:code == 1?'加载成功':'加载失败',
              };
            setTimeout(() => {
             this.loadingStatus = {
              isShow:false,
              showIcon:false,
              status:'',
            };
            this.pulldown = true;
          },1000);
        });
        },3000)
        
      },
    showPicPopup(img,item){
      this.picPopup.show = true;
      if(img.video == 1){
        this.picPopup.type = "video";
        this.picPopup.path.img = item.videos[img.id].cover_urls[0]
        this.picPopup.path.video = item.videos[img.id].url;
      }else{
        this.picPopup.type = "img";
        this.picPopup.path.img = this.baseimgpath+'id/'+img.id;
        this.picPopup.path.video = '';
      }
      
    },
    audioPlay:function(data){
      //播放音乐
      if(data.url == this.audio.audio_file){
        if(this.audio.audio_palying){
          this.audio.obj.pause();
          window.clearInterval(window.timeInter);
        }else{
          this.audio.obj.play();
          //开启计时器
          var vue = this;
          window.timeInter = setInterval(function(){
            vue.audio.time = parseInt(vue.audio.obj.duration) - parseInt(vue.audio.obj.currentTime);
          });
        }
        this.audio.audio_palying = !this.audio.audio_palying;
      }else{
        //判断是否在播放其它的如果播放则暂停
        if(this.audio.audio_file != '' && !this.audio.obj.paused){
           this.audio.obj.pause();
        }
        this.audio.audio_file = data.url;
        this.audio.time = data.dur;
      }
    }
  }
  ,watch:{
    'audio.audio_file'(){
      if(this.audio.audio_file == ''){
        return ;
      }
      this.audio.audio_palying = true;
      this.audio.obj = new Audio(this.audio.audio_file);
      this.audio.obj.play();
      var vue = this;
      this.audio.obj.addEventListener('canplay', function(e){
        window.timeInter = setInterval(function(){
          vue.audio.time = parseInt(vue.audio.obj.duration) - parseInt(vue.audio.obj.currentTime);
        });
      });
      this.audio.obj.addEventListener('pause', function(e){
        window.clearInterval(window.timeInter);
      });

      this.audio.obj.addEventListener('ended', function(e){
        window.clearInterval(window.timeInter);
        vue.audio.audio_palying = false;
        vue.audio.audio_file = '';
      },false);
    }
  }
  ,created:function(){
   setTimeout(()=>{
    this.getDataList(
      ()=>{
      this.loadingStatus={
        isShow:false,
        showIcon:false,
        status:'',
      };
    });
  },3000)
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
  },
  mounted:function(){
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
    /*margin:3px;*/
    width: 100%;
    height: 100%;
    background: #eee;
    transform:scale(0.98,0.98);
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
    background-size: 100% 100%;
  }
ul li .img-box div .mp4Img{
    background: url(/static/img/mp4.png) no-repeat 50%;
    background-size: 100% 100%;
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
