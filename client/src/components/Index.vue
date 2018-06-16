<template>
  <div class="hello">
    <div class="load-wrap">
      <mt-spinner v-show="!Object.keys(data).length" class="loading" type="double-bounce" color="rgb(38, 162, 255)"></mt-spinner>
    </div>
    <div v-show="Object.keys(data).length">
        <!-- <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange">
          <ul>
              <li v-for="item in data.list">{{ item.content }}</li>
          </ul>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
            <span v-show="topStatus === 'loading'">Loading...</span>
          </div>
      </mt-loadmore> -->
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="item in data.list">
        <h4>{{ item.content }}</h4>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Index'
  ,data (){
    return {
      data : {},
      loading: '',
    }
  }
  ,methods:{
    getDataList(){
      //判断本地是否有资源
      // if(window.sessionStorage.datalist){
      //   this.data = JSON.parse(window.sessionStorage.datalist);return ;
      // }
      let url = '/api/index/recommend';
      let vue = this;
      let data = {"h_ts":1528882985795,"h_model":"HUAWEI CRR-CL00","h_os":19,"direction":"down","tab":"推荐","h_dt":0,"h_av":"4.3.4","h_m":69753545,"h_did":"38C9864D89270000","android_id":"38C9864D89270000","h_ch":"baidu","token":"TcK9NKHn5iSng4ZCsJ0DlRUMA3nMPQS4MCozPXEfePCmbmuLsJ3c2pkgiPlRQNPyQwr5e","auto":0,"h_nt":1,"filter":"all","h_app":"zuiyou","c_types":[1,3,2,8,7,9,11]}
      this.$axios.post(url,data)
      .then(function(response) {
        if(response.data.ret == 1){
          //console.log(response.data.data);
          vue.$toast(
              {
                message: '获取到'+response.data.data.list.length+'条数据',
                position: 'bottom'
              }
            );
          vue.data = response.data.data;
          //window.sessionStorage.datalist = JSON.stringify(vue.data);
        }
      });
    }
    ,loadMore() {
        this.loading = true;
        //拉取数据
        this.loading = false;
      }
    // ,loadTop() {
    //   // 加载更多数据
    //   this.$refs.loadmore.onTopLoaded();
    // }
    // ,loadBottom() {
    //   // 加载更多数据
    //   this.allLoaded = true;// 若数据已全部获取完毕
    //   this.$refs.loadmore.onBottomLoaded();
    // }
    // ,handleTopChange(status) {
    //   this.topStatus = status;
    // }
  }
  ,created:function(){
    this.getDataList();
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
  }
  ul li{
    border-top:1px solid #eee;
    height: 50px;
    line-height: 50px;
  }
  ul li h4{
    font-size: 14px;
  }
</style>
