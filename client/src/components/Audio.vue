<template>
	<div class="picpopup-wrap">
       <div v-if="videoData" style="padding:10px 0;">
        <div style="width: 150px;height: 30px;border-radius: 4px;background: linear-gradient(to right, #2dcdff , #149eff);padding: 0 10px;line-height: 30px;" @click="audioPlay()">
          <img  :src="'/static/img/audio_'+(audio.audio_palying && audio.audio_file == videoData.url?'off':'on')+'.png'" width="9" height="11">
          <img src="/static/img/audio_line.png" width="9" height="11" style="margin-left: 5px;">
          <span style="float: right;color: white;">{{
            (audio.audio_file == videoData.url)?audio.time:videoData.dur
          }}s</span>
        </div>
      </div>
     </div>
</template>
<script>
export default {
	name: 'PicPopup'
	,data (){
		return {
			// audio:{
		 //        audio_palying : false,
		 //        audio_file : '',
		 //        obj : {},
		 //        time : 0,
		 //      },
		}
	},
	props:{
		videoData: {
	      type: Object,
	      default: ''
	    },
	    audio: {
	      type: Object,
	      default: ''
	    },
	},
	methods:{
		audioPlay:function(){
			this.$emit('play',this.videoData);
	      //播放音乐
	      
	      // if(this.videoData.url == this.audio.audio_file){
	        // if(this.audio.audio_palying){
	        //   this.audio.obj.pause();
	        //   window.clearInterval(timeInter);
	        // }else{
	        //   this.audio.obj.play();
	        //   //开启计时器
	        //   var vue = this;
	        //   window.timeInter = setInterval(function(){
	        //     vue.audio.time = parseInt(vue.audio.obj.duration) - parseInt(vue.audio.obj.currentTime);
	        //   });
	        // }
	        // this.audio.audio_palying = !this.audio.audio_palying;
	      // }
	      // else{
	      //   //判断是否在播放其它的如果播放则暂停
	      //   if(this.audio.audio_file != '' && !this.audio.obj.paused){
	      //      this.audio.obj.pause();
	      //   }
	        
	      // }
    	}
	},
	watch:{
		'audio.audio_file'(){
	      if(this.videoData.url != this.audio.audio_file){
	      	if(this.audio.obj){
	      		if(!this.audio.obj.paused){
	      			this.audio.obj.pause();
	      		}
	      	}
	      }
	      this.audio.audio_palying = true;
	      this.audio.obj = new Audio(this.audio.audio_file);
	      this.audio.obj.play();
	      var vue = this;
	      this.audio.obj.addEventListener('canplay', function(e){
	        window.timeInter = setInterval(function(){
	          vue.audio.time = parseInt(vue.audio.obj.duration) - parseInt(vue.audio.obj.currentTime);
	        });
	      });
	      this.audio.obj.addEventListener('pause', function(e){
	        window.clearInterval(window.timeInter);
	      });
	      this.audio.obj.addEventListener('ended', function(e){
	        window.clearInterval(window.timeInter);
	        vue.audio.audio_palying = false;
	        vue.audio.audio_file = '';
	      },false);
	    }
	},
	beforeUpdate(){
	}
}
</script>
<style scoped>

</style>