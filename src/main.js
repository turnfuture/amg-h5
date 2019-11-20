// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 请求接口封装
import {dataGet, dataPost} from './utils/axios.js'
import 'lib-flexible/flexible'
import './assets/iconfont/iconfont.css'
import './assets/css/mobile.css'
Vue.use(MintUI)
Vue.use(VueAwesomeSwiper)
Vue.use(require('vue-wechat-title'))
Vue.prototype.$dataGet = dataGet
Vue.prototype.$dataPost = dataPost

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  //   第一次进入项目
  let userId = window.localStorage.getItem('userId')
  if (!userId && to.path !== '/author') {
    window.localStorage.setItem('beforeLoginUrl', to.fullPath) // 保存用户进入的url
    next('/author')
    return false
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
