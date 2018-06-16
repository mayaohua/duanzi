# client

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

1、 path : http://api.izuiyou.com/smartdns/get
  request-data : {
		"h_ts": 1528958047374,
		"android_id": "38C9864D89270000",
		"h_model": "HUAWEI CRR-CL00",
		"h_ch": "baidu",
		"h_os": 19,
		"h_dt": 0,
		"h_av": "4.3.4",
		"h_nt": 1,
		"h_m": 0,
		"h_did": "38C9864D89270000",
		"h_app": "zuiyou"
	}
	response-data:{
	"ret": 1,
	"data": {
		"api": [{
			"tbapi.ixiaochuan.cn": ["106.15.82.26", "106.15.82.14"]
		}, {
			"api.izuiyou.com": ["106.15.82.26", "106.15.80.147", "106.15.82.14"]
		}, {
			"pipi.izuiyou.com": ["106.15.81.196"]
		}],
		"backoff": 60,
		"blacklist": ["10086.cn"],
		"connect_timeout": 15000,
		"diagnosis-video": true,
		"img": [{
			"tbfile.ixiaochuan.cn": ["111.7.187.81", "111.7.187.84", "111.7.187.82"]
		}, {
			"file.izuiyou.com": ["183.203.67.84", "183.203.67.83"]
		}],
		"img-net-info": {
			"batch": 10,
			"step": 1
		},
		"read_timeout": 15000,
		"sampling": {
			"batch": 10,
			"step": 20
		},
		"t": 1528958047,
		"ttl": 7200,
		"video": [{
			"tbvideo.ixiaochuan.cn": ["111.32.130.88", "111.32.130.86", "111.32.130.85"]
		}, {
			"video.izuiyou.com": ["111.62.68.237", "111.62.68.236", "111.62.68.234"]
		}, {
			"qnvideo.ixiaochuan.cn": ["113.96.109.99", "202.108.249.223"]
		}],
		"video-cdn-info": {
			"domain": {}
		},
		"video-sampling": {
			"batch": 10,
			"step": 0
		}
	}
}


2、host : http://api.izuiyou.com/account/register_guest?sign=24cc64cb61338b6113ed8cd09d154ee1
request-data:{
	"android_id": "38C9864D89270000",
	"h_model": "HUAWEI CRR-CL00",
	"h_ch": "baidu",
	"h_os": 19,
	"h_dt": 0,
	"h_av": "4.3.4",
	"uuid": "bb3d956b-4098-4b45-a0ea-17235ad147b1",
	"h_nt": 1,
	"h_m": 0,
	"h_did": "38C9864D89270000",
	"h_app": "zuiyou"
}
response-data:{
	"ret": 1,
	"data": {
		"mid": 69753545,
		"pw": "0bf91fc87060ba78",
		"token": "TcK7NKHn5iSng4ZCsJ0DlRUMA3srzoVcy_h5t7rnbBn4xeYXF2xbtAqVEgI3nqiaKc1lo",
		"did_action": "did"
	}
}