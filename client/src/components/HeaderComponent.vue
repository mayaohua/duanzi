<template>
	<mt-header :title="navTitle" :fixed="true">
	    <!-- <router-link to="/" slot="left">
	        <mt-button icon="back">返回</mt-button>
	    <mt-button icon="more" slot="right"></mt-button> -->
	</mt-header>
</template>
<script>
export default {
  name: 'HeaderComponent',
  data () {
    return {
     // navTitle:'首页',
  	}
  },
  props:['navTitle'],
  methods:{
    handleClick(){
      this.$toast('Hello world!')
    }
  },
}
</script>

<style scoped>
*{
      margin:0;
      padding:0;
}
</style>