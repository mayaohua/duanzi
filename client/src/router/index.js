import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Find from '@/views/Find'
import Setting from '@/views/Setting'
import Message from '@/views/Message'
Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
		path: '',
		components: {
			default: Index
		},
		redirect: '/index',
	}, {
		path: '/index',
		name: 'Index',
		component: Index,
		meta: {
			title: 'Index',
			keepAlive: true,
		}
	}, {
		path: '/find',
		name: 'Find',
		component: Find,
		meta: {
			title: 'Find',
			keepAlive: true,
		}
	}, {
		path: '/setting',
		name: 'Setting',
		component: Setting,
		meta: {
			title: 'Setting',
			keepAlive: true,
		}
	}, {
		path: '/message',
		name: 'Message',
		component: Message,
		meta: {
			title: 'Message',
			keepAlive: true,
		}
	}],
})