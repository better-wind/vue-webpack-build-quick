import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/vuex/store'
import Element from 'element-ui'


import '../src/assets/css/theme/index.css'

import './assets/js/common/poly'
import './assets/js/common/utils'

Vue.use(Element)
Vue.filter('toPrice', (data) => {
  return data ? data : 0
})
Vue.filter('toDate', (time) => {
  const day = parseInt(time / 1000 / 3600 / 24),
        hour = parseInt(time / 1000 / 3600) % 24,
        min = parseInt(time / 1000 / 60) % 60,
        sec = parseInt(time / 1000) % 60
  return day + '天' + hour +'小时' + min + '分' + sec + '秒'
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
