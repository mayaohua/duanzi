<template>
  <div class="audio-wrap">
    <div class="audio-box" @click="audioPlay()">
      <img :src="'/static/img/audio_'+(video_data.playing?'off':'on')+'.png'" width="9" height="11">
      <img src="/static/img/audio_line.png" class="line">
      <span class="text">{{video_data.time}}s</span>
    </div>
  </div>
</template>
<script>
export default {
	name: 'Audio'
	,data (){
		return {
			obj : {},
			video_data:{
				time:0,
				playing : false,
				loaded: false,
			}
		}
	},
	props:{
		data: {
	      type: Object,
	      default: ''
	    },
	    whoplay:{
	    	type: String,
	    	default: ''
	    }
	},
	methods:{
		audioPlay:function(){
			if(this.obj.src){
				if(this.video_data.playing){
					this.obj.pause();
				}else{
					this.obj.play();
				}
			}else{
				this.obj = new Audio(this.data.url);
			}
    	}
	},
	created(){
		this.video_data.time  =  this.data.dur;
	},
	mounted(){
		
	},
	watch:{
		'whoplay'(){
			if(this.data.url != this.whoplay){
				if(this.obj.src){this.obj.load()}
			}
		},
		'obj'(){
			var vue = this;
		    vue.obj.addEventListener('play', function(e){
		    	vue.video_data.playing = true;
		    	//告知父级当前音频正在播放
		    	vue.$emit('thisurl',vue.data.url)
		    });
		    vue.obj.addEventListener('timeupdate', function(e){
		    	//console.log('播放中');
		    	window.timeInter = setInterval(function(){
		        	vue.video_data.time = parseInt(vue.obj.duration) - parseInt(vue.obj.currentTime);
		        	vue.video_data.time == 0 && (vue.video_data.time = parseInt(vue.obj.duration))
		      	});
		    });
		    vue.obj.addEventListener('pause', function(e){
		    	//console.log('暂停');
		    	window.clearInterval(window.timeInter);
		    	vue.video_data.playing = false;
		    });
		    vue.obj.addEventListener('ended', function(e){
		    	//console.log('播放完毕');
		    	window.clearInterval(window.timeInter,()=>{
					vue.video_data = {
						'time' : parseInt(vue.obj.duration),
		    			'playing' : false
					}
		    	});
		     },false);
		    vue.obj.addEventListener('loadeddata', function(e){
		    	//console.log('加载数据');
		    	vue.video_data.time = parseInt(vue.obj.duration);
		    	vue.video_data.playing = false;
		    	if(vue.video_data.loaded == false){
		    		vue.obj.play();
		    		vue.video_data.loaded = true;
		    	}
		    });
		}
	}
}
</script>
<style scoped>
.audio-wrap{
	padding:10px 0;
}
.line{
	margin-left: 5px;
	width: 9px;
	height: 11px;
}
.audio-box{
	width: 150px;
	height: 30px;
	border-radius: 4px;
	background: linear-gradient(to right, #2dcdff , #149eff);
	padding: 0 10px;
	line-height: 30px;
}
.text{
	float: right;
	color: white;
}
</style>