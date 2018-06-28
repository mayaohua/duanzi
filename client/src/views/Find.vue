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
          "token": "TcK1NKHn5iSng4ZCsJ0DlRUMA3oPMNA8mEESo9j_HzF8FwzV4U5Hw76W4UyznX2Lq4-0u",
          "tid": 112357,//声控
          "next_cb": "",
        }
      }
    }
  }
}
</script>
