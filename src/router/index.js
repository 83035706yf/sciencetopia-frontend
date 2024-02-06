// router.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePageVue from '@/views/HomePage.vue'
import LogIn from '@/components/LogIn.vue'
import ReGister from '@/components/ReGister.vue'
import PersonalCenter from '@/components/PersonalCenter.vue'
import AccountCenter from '@/components/AccountCenter.vue'
import StudyGroupList from '@/components/StudyGroupList.vue'
import StudyGroupPage from '@/components/StudyGroupPage.vue'
import StudyGroupSpace from '@/components/StudyGroupSpace.vue'
import CreateStudyGroup from '@/components/CreateStudyGroup.vue'

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
  {
    path: '/personalurl',
    name: 'personalcenter',
    component: PersonalCenter
  },
  {
    path: '/personalurl/account',
    name: 'accountcenter',
    component: AccountCenter
  },
  {
    path: '/allstudygroups',
    name: 'studyGroupList',
    component: StudyGroupList
  },
  {
    path: '/createstudygroup',
    name: 'createStudyGroup',
    component: CreateStudyGroup
  },
  {
    path: '/studygroup/:id',
    component: StudyGroupPage
  },
  {
    path: '/studygroup/:id/space',
    component: StudyGroupSpace
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
