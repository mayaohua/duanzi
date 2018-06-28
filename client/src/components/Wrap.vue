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
    <div class="box">
          <ul id="scrollWrap" ref="scroll-wrap" >
          <li v-for="item in data.list">
            <!-- 内容 -->
            <p v-if="item.content" >{{ item.content }}</p>
            <!-- 图片 -->
            <div class="img-box" v-if="item.imgs" >
                <div v-for="img in getImgsPath(item.imgs)" :style="{width:item.imgs.length==1?'100%':item.imgs.length==2?'50%':'33.3%'}" @click="showPicPopup(img,item)">
                  <div>
                    <!-- v-lazy.scrollWrap="img.pathimg" -->
                    <img  :style="changeImgW(item.imgs)" v-lazy.scrollWrap="img.pathimg">
                    <span v-show="img.fmt == 'gif'" class="gifImg typeImg"></span>
                    <span v-show="img.video == 1" class="mp4Img typeImg"></span>
                  </div>
                </div>
            </div>
            <!-- 神评 -->
            <div class="evaluate" v-if="item.god_reviews instanceof Array">
                <mt-badge type="error">神</mt-badge>
                <!-- 文字 -->
                <p v-html="item.god_reviews[0].review"></p>
                <!-- 图片 -->
                <div class="img-box" v-if="item.god_reviews[0].imgs" >
                    <div v-for="img in getImgsPath(item.god_reviews[0].imgs)" :style="{width:item.god_reviews[0].imgs.length==1?'100%':item.god_reviews[0].imgs.length==2?'50%':'33.3%'}" @click="showPicPopup(img,item.god_reviews[0])">
                      <div>
                        <!-- v-lazy.scrollWrap="img.pathimg" -->
                        <img  :style="changeImgW(item.god_reviews[0].imgs)" v-lazy.scrollWrap="img.pathimg">
                        <span v-show="img.fmt == 'gif'" class="gifImg typeImg"></span>
                        <span v-show="img.video == 1" class="mp4Img typeImg"></span>
                      </div>
                    </div>
                </div>
                <!-- 语音 -->
                <div v-if="item.god_reviews[0].audio">
                  <AudioTag :data="item.god_reviews[0].audio" :whoplay="whoplay" @thisurl='updateaudio'></AudioTag>
                </div>
            </div>
          </li>
        </ul>
    </div>
  </MyScroll>
  <!-- 图片展示 -->
  <PicPopup :obj="picPopup" @closePicPopup="picPopup.show = false"/>
  </div>
</template>
<script>
import PicPopup from '../components/PicPopup'
import MyScroll from '../components/MyScroll'
import AudioTag from '../components/Audio'

export default {
  name: 'Index'
  ,components:{
    PicPopup,
    MyScroll,
    AudioTag
  },
  props: {
     request : {
      type : Object
     }
  }
  ,data (){
    return {
      pulldown: true,
      whoplay : '',
      pullup: true,
      picPopup:{
          show:false,
          path : {
            img:'',
            video:'',
          },
          type:'img',
      },
      //重新加载
      loadingStatus: {},
      loadingStatusArr: [
          {isShow:true,showIcon:true,status:''},
          {isShow:true,showIcon:false,status:'加载成功'},
          {isShow:true,showIcon:false,status:'加载失败'},
          {isShow:false,showIcon:false,status:''}
      ],
      //加载更多
      loadingMore : false,
      //没有了
      more:true,
      data : {},
      baseimgpath:'https://file.izuiyou.com/img/view/',

    }
  }
  ,methods:{
    getDataList(callback){
      //判断本地是否有资源
      // if(window.sessionStorage.datalist){
      //   this.data = JSON.parse(window.sessionStorage.datalist);return ;
      // }
      if(!this.more){
        return;
      }
      let vue = this;
      this.$axios.post(this.request.baseurl,this.request.requestdata)
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
          vue.request.requestdata.next_cb = response.data.data.next_cb;
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
          console.log(error);
      });
    },
    getImgsPath(imgArr){
      var showW = document.body.clientWidth;
      let vue = this;
      let sz = 0;
      let marginx = 0;
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
    },
    changeImgW(imgs){
      return (imgs.length==1) ? {minWidth:parseInt(document.body.offsetWidth - 10)+'px'} : {}
    },
    loadMore() {
      this.pullup = false;
      this.loading = true;
      let vue = this;
      this.loadingMore = true;
      setTimeout(()=>{
        vue.getDataList((code)=>{
          vue.loadingMore = false;
          vue.pullup = true;
        });
      },2500)
    },
    loadTop() {
        // 回到顶部
        this.pulldown = false;
        // 加载更多数据
        this.loadingStatus = this.loadingStatusArr[0]
        this.request.requestdata.next_cb = '';
        setTimeout(()=>{
          this.data = {};
          this.getDataList((code)=>{
            this.loadingStatus = (code == 1)?this.loadingStatusArr[1]:this.loadingStatusArr[2];
            setTimeout(() => {
              this.loadingStatus = this.loadingStatusArr[3];
              this.pulldown = true;
            },1000);
          });
        },2500)
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
    updateaudio(data){
      this.whoplay = data;
    }
  }
  ,created:function(){
    this.loadingStatus = this.loadingStatusArr[0]
    setTimeout(()=>{
    this.getDataList(()=>{
      this.loadingStatus=this.loadingStatusArr[3];
    });
   },2500)
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
    max-height: 200px;
    overflow: hidden;
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
      max-height: 100px;
      overflow: hidden;
  }
</style>
