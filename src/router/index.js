import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { login, updateDetail, getUser } from '@/api/api.js'
import { getUrlCode } from '@/utils/index.js'
import { baselogin } from '@/api/api'
Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Home
  },
  {
    path: '/copyhome',
    name: 'copyhome',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/copyhome.vue')
  },
  {
    path: '/copynewhome',
    name: 'copynewhome',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/copynewhome.vue')
  },
  {
    path: '/newAsk',
    name: 'newAsk',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/newAsk.vue')
  },
  {
    path: '/howAsk',
    name: 'howAsk',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/howAsk.vue')
  },
  {
    path: '/About',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/detail',
    name: 'Detail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Detail.vue')
  },
  {
    path: '/mine',
    name: 'Mine',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Mine.vue')
  },
  {
    path: '/recyclesBin',
    name: 'RecyclesBin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RecyclesBin.vue')
  },
  {
    path: '/shield',
    name: 'shield',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/shield.vue')
  },
  {
    path: '/report',
    name: 'report',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/report.vue')
  },
  {
    path: '/Record',
    name: 'Record',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Record.vue')
  },
  {
    path: '/poster',
    name: 'poster',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/poster.vue')
  },
  {
    path: '/feedback',
    name: 'feedback',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/feedback.vue')
  },
  {
    path: '/',
    name: 'edit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Edit.vue')
  },
  {
    path: '/setPhone',
    name: 'setPhone',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/setPhone.vue')
  },
  {
    path: '/FeedbackRecord',
    name: 'FeedbackRecord',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/FeedbackRecord.vue')
  },
  {
    path: '/FbrecordDetail',
    name: 'FbrecordDetail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/FbrecordDetail.vue')
  },




]

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/niming_letter/' : process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 路由前置拦截，如果有query中有code,就调用登录接口换取session
  // 非静默授权获取用户信息


  // if (to.name === 'edit' || to.name === 'Home') {
  //   if (getUrlCode().code) {
  //     login(getUrlCode().code).then(result => {
  //       localStorage.setItem("session", result.data.session);
  //       localStorage.setItem("uid", result.data.uid);

  //     })
  //   }
  // } else {
  //   if (getUrlCode().code) {
  //     baselogin(getUrlCode().code).then(result => {
  //       localStorage.setItem("session", result.data.session);
  //       localStorage.setItem("uid", result.data.uid);
  //     })
  //   }
  // }
  if (getUrlCode().code && localStorage.getItem('session')) {
    baselogin(getUrlCode().code).then(result => {
      localStorage.setItem("session", result.data.session);
      localStorage.setItem("uid", result.data.uid);
    })
    console.log('登录过期')
  }
  next()

})

export default router

