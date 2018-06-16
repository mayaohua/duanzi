<template>
  <div class="wrap">
    <div class="load-wrap">
      <mt-spinner v-show="!Object.keys(data).length" class="loading" type="double-bounce" color="rgb(38, 162, 255)"></mt-spinner>
    </div>
    <div id="scrollWrap" v-show="Object.keys(data).length">
        <h2 v-for="item in data.list">FInd Page</h2>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Find'
  ,data (){
    return {
      data : {},
    }
  }
  ,methods:{
    getDataList(){
      let url = '/api/index/webrecommend';
      let vue = this;
      this.$axios.post(url)
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
        }
      });
    }
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
    z-index: -1;
  }
</style>
