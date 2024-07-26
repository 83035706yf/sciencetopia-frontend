// router.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store.js'
import HomePageVue from '@/views/HomePage.vue'
import SearchListPage from '@/views/SearchListPage.vue'
import LogIn from '@/components/LogIn.vue'
import ReGister from '@/components/ReGister.vue'
import PersonalCenter from '@/components/PersonalCenter.vue'
import MessageCenter from '@/components/MessageCenter.vue'
import AccountCenter from '@/components/AccountCenter.vue'
import StudyGroupList from '@/components/StudyGroupList.vue'
import StudyGroupPage from '@/components/StudyGroupPage.vue'
import StudyGroupSpace from '@/components/StudyGroupSpace.vue'
import CreateStudyGroup from '@/components/CreateStudyGroup.vue'
import SponsorShip from '@/components/SponsorShip.vue'
import AboutUs from '@/components/AboutUs.vue'
import ContactUs from '@/components/ContactUs.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePageVue,
  },
  {
    path: '/search',
    name: 'searchList',
    component: SearchListPage,
    props: true
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
    path: '/personalurl/message',
    name: 'messagecenter',
    component: MessageCenter,
    children: [
      {
        path: 'directMessages',
        name: 'directMessages',
        component: MessageCenter,
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: MessageCenter,
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/messages/directMessages'
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
    path: '/studygroup/:groupId',
    name: 'studyGroupPage',
    component: StudyGroupPage,
    props: true, // Enables the route parameter to be passed as a prop to the component
  },
  {
    path: '/studygroup/:groupId/space',
    name: 'studyGroupSpace',
    component: StudyGroupSpace,
    props: true, // Enables the route parameter to be passed as a prop to the component
  },
  {
    path: '/support',
    name: 'support',
    component: SponsorShip
  },
  {
    path: '/about',
    name: '/about',
    component: AboutUs
  },
  {
    path: '/contact',
    name: '/contact',
    component: ContactUs
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  store.commit('resetSelectedNodes'); // commit the mutation
  next(); // proceed to the next route
});

export default router
