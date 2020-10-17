import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
Vue.use(VueAxios, axios)

/*  全局别名$qs,组建中使用：this.$qs.stringify({参数}) */
Vue.prototype.$qs = qs

/* 全局设置 */
axios.defaults.baseURL = 'http://localhost:8028'
/* 自定义实例 */
let instance = axios.create({
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
})
/* 请求拦截 */
instance.interceptors.request.use(
  config => {
    return config
  },
  err => {
    // 请求错误
    return Promise.reject(err)
  }
)
/* 响应拦截 */
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error.response.status) // 返回接口返回的错误信息
  }
)
export default instance
