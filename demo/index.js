/**
 * 作者：yujinjin9@126.com
 * 时间：2018-01-29
 */
import babelPolyfill from 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import vueApp from "./app"
import Vuex from 'vuex'
import ListPullLoading from '../src/index'
//import ListPullLoading from '../dist/list-pull-loading'
//import "../dist/list-pull-loading.css"
import vueLazyload from './lib/vue-lazyload'

Vue.use(VueRouter);
Vue.use(ListPullLoading);
Vue.use(vueLazyload, {
	preLoad: 1.3,
	error: require("./imgs/error.jpg"),
	loading: require("./imgs/loading-spin.svg"),
	attempt: 1, //出错时只尝试加载次数
	filter: {
		progressive(listener, options) {
			listener.el.setAttribute('lazy-progressive', 'true');
		},
		webp(listener, options) {
			if(!options.supportWebp) return
		}
	}
});
Vue.use(Vuex);
// 实例化Vuex
var store = new Vuex.Store({
	state: {
		direction: null, //going：前进|backing后退|replace
		navbarTitle: "", //app的导航页标题
		locationInfo: {
			demo4CacheData: null, // demo4的数据缓存
		}
	},
	mutations: {
		//修改路由的方向
		updateDirection(state, direction = "going") {
			state.direction = direction;
		},
		//修改导航标题
		updateNavbarTitle(state, navbarTitle) {
			state.navbarTitle = navbarTitle;
		},
		//修改app临时数据
		updateLocationInfo(state, {key, value}) {
			state.locationInfo[key] = value;
		}
	},
	actions: {
		updateDirection({commit}, direction) {
			commit("updateDirection", direction);
		},
		updateNavbarTitle({commit}, navbarTitle) {
			commit("updateNavbarTitle", navbarTitle);
		},
		updateLocationInfo({commit}, {key, value}) {
			commit("updateLocationInfo", {key, value});
		}
	}
});
// 实例化路由
var router = new VueRouter({
	routes: [{
		path: '/',
		name: "index",
		meta: {title: "主页"},
		component: require('./index.vue').default
	}, {
		path: '/demo1',
		name: "demo1",
		meta: {title: "demo1"},
		component: require('./demo1.vue').default
	}, {
		path: '/demo2',
		name: "demo2",
		meta: {title: "demo2"},
		component: require('./demo2.vue').default
	}, {
		path: '/demo3',
		name: "demo3",
		meta: {title: "demo3"},
		component: require('./demo3.vue').default
	}, {
		path: '/demo4',
		name: "demo4",
		meta: {title: "demo4"},
		component: require('./demo4.vue').default
	}],
	mode: 'history',
	base: "/",
	linkActiveClass: "router-link-active"
});
router.beforeEach(function(to, from, next) {
	if(store.state.direction) {
		store.dispatch("updateDirection", store.state.direction);
	} else {
		// 当前没有路由的方向就认为是返回，因为移动端是没有前进按钮的（这个判断也是无奈，如果是手机浏览器就无法解决）
		store.dispatch("updateDirection", "backing");
	}
	store.dispatch("updateNavbarTitle", to.meta.title);
	next();
	store.dispatch("updateDirection", null);
});
router.afterEach(function(router, store){
	let title = "下拉刷新上拉加载组件实例";
	if(router.meta && router.meta.title) {
		document.title = title + "-" + title;
	}
});
let VueApp = Vue.extend(vueApp);
window.store = store;
new VueApp({ router, name: "app", store }).$mount('#app');
