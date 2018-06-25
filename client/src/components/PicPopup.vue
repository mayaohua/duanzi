<template>
	<div class="picpopup-wrap" v-show="obj.show">
        <div class="slides">
        	<div class="slide">
        		<img  v-show="!loadshow && obj.type=='img'" @load="loadimg()" :src="obj.path.img">
	        	<video x5-playsinline="" playsinline="" webkit-playsinline="" ref="video" v-show="!loadshow && obj.type=='video'" @canplay="loadimg()" controls="controls"   :src="obj.path.video" :poster="obj.path.img">
	        	</video>
	        	<!-- autoplay="false" -->
	        	<img class="load" v-show="loadshow" :src="loadingpath">
        	</div>
        </div>
        <span @click="close()">×</span>
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
	z-index: 9999;
	overflow: auto;
}
.picpopup-wrap span{
	position: absolute;
	/*top:50px;*/
	right:0px;
	color:white;
	font-size: 30px;
	display: block;
	padding: 20px;
	top:0;
}
.picpopup-wrap div.slides{
	position: relative;
    height: 100%;
    overflow: auto;
}
.picpopup-wrap .slide{
	position: absolute;
	top:50%;
	width: 100%;
	transform: translate(0,-50%);
}

.picpopup-wrap .slide img{
	width: 100%;
	display: block;
	margin: auto;
}
.picpopup-wrap .slide video{
	width: 100%;
	margin: auto;
	position: absolute;
	top: 50%;
    left: 0;
    transform: translateY(-50%);
}
.picpopup-wrap .slide img.load{
	width: 50px;
	height: 50px;
}
.picpopup-wrap .slide img.mp4{
	width: 100px;
	height: 100px;
}
</style>