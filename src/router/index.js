import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('../components/home/Home'),
    children:[
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('../components/Welcome')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../views/user/User')
      }
    ]
  }

]

const router = new VueRouter({
  mode: "history",
  routes
})

// router.beforeEach((to, from, next) => {
//    if(to.path === '/log') return next()
//    const tokenStr = window.sessionStorage.getItem('token')
//    if(!tokenStr) return next('/log')
//     next()

// })
router.beforeEach((to, from, next) => {
  var userInfo = window.sessionStorage.getItem('token');//获取浏览器缓存的用户信息
  if (userInfo) { //如果有就直接到首页咯
    next();
  } else {
    // 排除此时地址 = 转向的地址 的情况，避免dead loop, 问题很简单，但一不小心就入坑了
    if (to.path === '/login') { //如果是登录页面路径，就直接next()
      next();
    } else { //不然就跳转到登录；
      next('/login');
    }

  }
})

export default router
