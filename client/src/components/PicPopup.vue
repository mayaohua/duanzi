<template>
	<div class="picpopup-wrap" v-show="obj.show">
        <div class="slides">
        	<div class="slide">
        		<img ref="videoimg" v-show="!loadshow" @load="loadimg()" :src="obj.path.img">
        		<span @click="videopaly()" v-show="obj.type=='video'"></span>
	        	<video webkit-playsinline="true" x-webkit-airplay="true"  playsinline="true"  ref="video"  @canplay="loadimg()" controls="controls"  :src="obj.path.video" :poster="obj.path.img" v-show="palying">
	        	</video>
	        	<!-- autoplay="false" -->
	        	<img class="load" v-show="loadshow" :src="loadingpath">
        	</div>
        </div>
        <span ref="close" @click="close()">×</span>
     </div>
</template>
<script>
export default {
	name: 'PicPopup'
	,data (){
		return {
			loadshow:true,
			loadingpath : '/static/img/loading_1.gif',
			palying:false,
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
		},
		videopaly(){
			this.$refs.video.play();
		}
	},
	watch:{
		'obj.path.img'(){
			this.loadshow = true;
			//视频监听
			let vue = this;
		    this.$refs.video.addEventListener('play',function(){
		    	vue.palying = true;
		    	vue.$refs.close.style.display="none";
			});
			this.$refs.video.addEventListener('pause',function(){
				vue.palying = false;
				vue.$refs.close.style.display="block";
			});
		}
	},
	beforeUpdate(){
	},
	updated(){
		var agent = navigator.userAgent.toLowerCase();
	    if (agent.match(/MicroMessenger/i) != "micromessenger") {
	        this.$refs.video.setAttribute('x5-video-player-type','h5')
	        this.$refs.video.setAttribute('x5-video-player-fullscreen',true)
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
	z-index: 9999;
	overflow: auto;
}
.picpopup-wrap span{
	display: block;
	text-align: center;
	position: absolute;
	/*top:50px;*/
	right:0px;
	font-size: 30px;
	line-height: 30px;
	width: 30px;
	height: 30px;
	display: block;
	padding: 10px;
	top:0;
	background: linear-gradient(to right, white, black);
	-webkit-background-clip: text;
	color: transparent;
	/*background: -webkit-linear-gradient(left top, red , blue); !* Safari 5.1 - 6.0 *!*/
    /*background: -o-linear-gradient(bottom right, red, blue); !* Opera 11.1 - 12.0 *!*/
    /*background: -moz-linear-gradient(bottom right, red, blue); !* Firefox 3.6 - 15 *!*/
	/*background: linear-gradient(to bottom right, red , blue);*/
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
    object-fit: fill;
}
.picpopup-wrap .slide img.load{
	width: 50px;
	height: 50px;
}
.picpopup-wrap .slide img.mp4{
	width: 100px;
	height: 100px;
}
.picpopup-wrap .slide span{
	position: absolute;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: 25px;
    height: 25px;
    left:0;
    top: 0;
    bottom: 0;
    right: 0;
    display: block;
    margin: auto;
    background: url(/static/img/mp4.png) no-repeat 50%;
    background-size: 100% 100%;
}
</style>