<template>
  <div>
    <Wrap :request="request"></Wrap>
  </div>
</template>
<script>
import Wrap from '../components/Wrap'

export default {
  name: 'Index'
  ,components:{
    Wrap,
  },
  data (){
    return {
      request: {
        baseurl:  "/api/topic/posts_list",  
        requestdata: {
          "sort": "new",//hot
          "h_m": 69753545,
          "token": "TcK1NKHn5iSng4ZCsJ0DlRUMA3oPMNA8mEESo9j_HzF8FwzV4U5Hw76W4UyznX2Lq4-0u",
          "tid": 126160,//全他妈都是套路
          "next_cb": "",
        }
      }
    }
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
