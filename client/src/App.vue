<template>
  <div>
     <headerComponent :navTitle = "navTitle"></headerComponent>
	    <keep-alive >
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    
      <footerComponent v-on:navTitle="getNavTitle"></footerComponent>
  </div>
</template>
<script>
import headerComponent from './components/HeaderComponent'
import footerComponent from './components/FooterComponent'
export default {
 name: 'App',
  data () {
    return {
      navTitle:'',
    }
  },
  components: {
    headerComponent,footerComponent
  },
  methods:{
    handleClick(){
      this.$toast('Hello world!')
    },
    getNavTitle(text){
    	this.navTitle = text;
    }
  },
  created:function(){
  },
  mounted: function() {
    // 指定初始路由
    //this.$router.push('/index');
  },
}
</script>

<style>
*{
      margin:0;
      padding:0;
}
  .wrap{
    position: absolute;
    overflow-x: hidden;
    /*overflow-y: scroll;*/
    box-sizing: border-box;
    top:40px;
    bottom:55px;
    width: 100%;
    /*-webkit-overflow-scrolling: touch;*/
  }
</style>
