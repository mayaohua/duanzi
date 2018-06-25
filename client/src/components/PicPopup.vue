<template>
	<div class="picpopup-wrap" v-show="obj.show">
        <span @click="close()">×</span>
        <div>
        	
        	<img  v-show="!loadshow && obj.type=='img'" @load="loadimg()" :src="obj.path.img">
        	<video ref="video" v-show="!loadshow && obj.type=='video'" @canplay="loadimg()" controls="controls" autoplay loop  :src="obj.path.video" :poster="obj.path.img">
        		
        	</video>
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
		obj: {
	      type: Object,
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
			if(this.obj.type=='video'){
				this.$refs.video.pause();
			}
			this.obj.show = false;
		}
	},
	watch:{
		'obj.path.img'(){
			this.loadshow = true;
		}
	},
	beforeUpdate(){
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
	overflow: auto;
}
.picpopup-wrap span{
	position: absolute;
	top:50px;
	right:20px;
	color:white;
	font-size: 30px;
	display: block;
	z-index: 4;
}
.picpopup-wrap div{
	position: absolute;top:50%;width: 100%;transform: translate(0,-50%);z-index: 1;
}
.picpopup-wrap div img{
	width: 100%;
	display: block;
	margin: auto;
}
.picpopup-wrap div video{
	width: 100%;
	display: block;
	margin: auto;
	position: absolute;
	top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 1;
}
.picpopup-wrap div img.load{
	width: 50px;
	height: 50px;
}
.picpopup-wrap div img.mp4{
	width: 100px;
	height: 100px;
}
</style>