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
  // localStorage.setItem('userId', '09284dc4c77a40febb3629c5bacfa04b')
  //   第一次进入项目 没有userid直接去授权
  let userId = window.localStorage.getItem('userId')
  if (userId === null && to.path !== '/author') {
    window.localStorage.setItem('beforeLoginUrl', to.fullPath) // 保存用户进入的url
    next('/author')
    return false
  } else if (userId) {
    // 如果存在userid，查询数据库是否存在该用户
    dataPost('/api/member/haveUser', {
      userId: userId
    }, (res) => {
      if (parseInt(res.code) !== 0) {
        window.localStorage.clear()
        window.localStorage.setItem('beforeLoginUrl', to.fullPath) // 保存用户进入的url
        next('/author')
        return false
      }
      next()
    })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
