// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import axios from './http'
import './filter'
import './element-ui'
import './assets/style/common.css'
Vue.config.productionTip = false /* 阻止启动生产消息，常用作指令。 */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
})
