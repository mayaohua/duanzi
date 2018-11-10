// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Mint from 'mint-ui';
import base from './base.vue.js';
import VueLazyload from 'vue-lazyload'
//import 'vuescroll/dist/vuescroll.css';
// import vuescroll from 'vuescroll';
// Vue.use(vuescroll);

Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: '/static/img/img_error.png',
	loading: '/static/img/loading_4.svg',
	attempt: 1
})
Vue.use(base);
Vue.use(Mint);
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})