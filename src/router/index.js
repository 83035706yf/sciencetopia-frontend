// router.js
import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '../components/LogIn.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  // ... 其他路由配置
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
