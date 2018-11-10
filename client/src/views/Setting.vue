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
          "sort": "new",//hot
          "h_m": 69753545,
          "token": "TcK1NKHn5iSng4ZCsJ0DlRUMA3oPMNA8mEESo9j_HzF8FwzV4U5Hw76W4UyznX2Lq4-0u",
          "tid": 126160,//全他妈都是套路
          "next_cb": "",
          "c_types": [1, 2, 3, 9]
        }
      }
    }
  }
}
</script>
