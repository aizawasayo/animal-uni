import App from './App'
import store from './store'
import UniLoading from './components/uni-loading/uni-loading.vue'
import UniRefresher from './components/uni-refresher/uni-refresher.vue'
import UniNomore from './components/uni-nomore/uni-nomore.vue'
import filters from './common/filters' // filters 全局过滤器
import globalApi from './common/global-api' // 全局方法

// #ifndef VUE3
import Vue from 'vue'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store

const app = new Vue({
  ...App,
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import Vuex from 'vuex'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  // #ifndef H5
  app.provide('apiUrl', 'http://106.54.168.208:3003')
  // app.provide('apiUrl', 'http://192.168.31.168:3003')
  // #endif
  // #ifdef H5
  app.provide('apiUrl', '/api')
  // #endif
  app.provide('utils', globalApi)

  // 模版过滤器
  app.config.globalProperties.$filters = filters

  app.config.globalProperties.loadText = {
    contentdown: '上拉加载更多',
    contentrefresh: '加载中',
    contentnomore: '没有更多了',
  }

  app.component('uni-loading', UniLoading)
  app.component('uni-refresher', UniRefresher)
  app.component('uni-nomore', UniNomore)

  return {
    app,
    Vuex,
  }
}
// #endif
