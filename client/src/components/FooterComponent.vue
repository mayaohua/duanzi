
<template>
	<footer class="mint-tabbar" :fixed="true">
		<router-link tag="a" v-for="(item,index) in tabbarArr" class="mint-tab-item" :to="item.tabid" active-class="is-selected"  :key="index">
		    <div @click="changeNavTitle(item.tabid)">
            <div class="mint-tab-item-icon">
              <img slot="icon" :src="item.tabimg">
            </div>
            <div class="mint-tab-item-label">
            {{item.tabname}}
            </div>  
        </div>
		</router-link>
		<!-- <mt-tabbar v-model="selected">
		  <mt-tab-item  v-for="(item,index) in tabbarArr" :key="index" :id="item.tabid">
		    <img slot="icon" :src="item.tabimg">
		    {{item.tabname}}
		  </mt-tab-item>
		</mt-tabbar> -->
	</footer>
</template>
<script>
export default {
  name: 'FooterComponent',
  data () {
    return {
      selected:'/',
      navTitle:'',
      tabbarArr:[
      	{
      		'tabname':'最右',
      		'tabid':'/index',
      		'tabimg':'/static/img/index_tarbar.png'
      	},
      	{
      		'tabname':'发现',
      		'tabid':'/find',
      		'tabimg':'/static/img/find_tarbar.png'
      	}
      	,{
      		'tabname':'消息',
      		'tabid':'/message',
      		'tabimg':'/static/img/message_tarbar.png'
      	}
      	,{
      		'tabname':'设置',
      		'tabid':'/setting',
      		'tabimg':'/static/img/setting_tarbar.png'
      	}
      ]
  	}
  },
  methods:{
    handleClick(){
      this.$toast('Hello world!')
    }
    ,changeNavTitle(newvalue){
    	var vue = this;
  		this.tabbarArr.map((value)=>{(value.tabid == newvalue) && (vue.navTitle = value.tabname )})
  		vue.$emit('navTitle',vue.navTitle)
    }
  },
  created:function(){
  	this.selected = this.$route.path;
	  this.changeNavTitle(this.selected);
  }
}
</script>

<style >
*{
      margin:0;
      padding:0;
}
.mint-tabbar{
	position: fixed;
	z-index: 1;
}
footer .is-selected .mint-tab-item-label{color:#26a2ff;}
footer .mint-tab-item-label{color:black;}
</style>