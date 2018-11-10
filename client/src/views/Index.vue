<template>
  <div>
    <Wrap :request="request"></Wrap>
  </div>
</template>
<script>
import Wrap from '../components/Wrap'

export default {
  name: 'Index'
  ,components:{
    Wrap,
  },
  data (){
    return {
      request: {
        baseurl:  "/api/topic/posts_list",  
        requestdata: {
          "sort": "hot",//hot
          "h_m": 69753545,
          "token": "TcK7NKHn5iSng4ZCsJ0DlRUMA3srzoVcy_h5t7rnbBn4xeYXF2xbtAqVEgI3nqiaKc1lo",
          "tid": 118719,
          "next_cb": "",
          "c_types": [1, 2, 3, 9]
	}
      }
    }
  }
}
</script>
