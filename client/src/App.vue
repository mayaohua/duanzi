<template>
  <div>
     <!-- <headerComponent :navTitle = "navTitle"></headerComponent> -->
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
    getNavTitle(text){
    	this.navTitle = text;
    }
  },
  created:function(){
  },
  mounted: function() {
     console.log(this.$route);
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
    box-sizing: border-box;
    top:0px;
    bottom:55px;
    width: 100%;
  }
</style>
