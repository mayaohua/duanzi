<template>
	<div class="picpopup-wrap" v-show="show">
        <span @click="close()">×</span>
        <div>
        	<img v-show="!loadshow" @load="loadimg()" :src="imgpath">
        	<img class="load" v-show="loadshow" :src="loadingpath">
        </div>
     </div>
</template>
<script>
export default {
	name: 'PicPopup'
	,data (){
		return {
			loadshow:true,
			loadingpath : '/static/img/loading_1.gif',
		}
	},
	props:{
		imgpath: {
	      type: String,
	      default: ''
	    },
	    show:{
	    	type:Boolean,
	    	default:false,
	    }
	},
	methods:{
		loadimg(){
			this.loadshow = false;
		},
		close(){
			this.$emit('closePicPopup',false)
		}
	},
	watch:{
		imgpath(){
			this.loadshow = true;
		}
	}
}
</script>
<style scoped>
.picpopup-wrap{
	position: fixed;
	top:0;
	right:0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.9);
	z-index: 3;
}
.picpopup-wrap span{
	position: absolute;
	top:10px;
	right:15px;
	color:white;
	font-size: 30px;
	display: block;
	z-index: 4;
}
.picpopup-wrap div{
	position: absolute;top:50%;width: 100%;transform: translate(0,-50%);
}
.picpopup-wrap div img{
	width: 100%;height: 100%;
	display: block;
	margin: auto;
}
.picpopup-wrap div img.load{
	width: 50px;
	height: 50px;
	
}

</style>