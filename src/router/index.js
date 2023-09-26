// router.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePageVue from '@/views/HomePage.vue'
import LogIn from '../components/LogIn.vue'
import ReGister from '@/components/ReGister.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePageVue,
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn,
  },
  {
    path: '/register',
    name: 'register',
    component: ReGister
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
