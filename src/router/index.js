import Vue from 'vue'
import Router from 'vue-router'
import routes from './routerConfig'
Vue.use(Router)

export const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior: () => ({x: 0, y: 0})
})
