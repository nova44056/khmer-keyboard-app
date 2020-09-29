import Vue from 'vue'
import VueRouter from 'vue-router'
import timeselector from '../components/TimeSelectorComponents/TimeSelector'
import typeselector from '../components/TextSelectorComponents/TypeSelector'
import typingpage from '../components/TypingPage'
import logIn from '../views/logIn.vue'
import signIn from '../views/signIn.vue'
import test from '../components/Test'
import test2 from '../duplicate'
import typeFast from '../Typefast'
import result from '../components/result'
import store from '../store/index'
import testing from '../components/Test2'
import instruction from '../components/instruction'
import aboutus from '../components/AboutUs'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/timeSelector'
  },
  {
    path: '*',
    redirect: '/1'
  },
  {
    path: '/1',
    name: 'SelectionPage1',
    component: timeselector
  },
  {
    path: '/typeSelector',
    name: 'SelectionPage2',
    component: typeselector,
    beforeEnter: (to,from,next)=>{
      if(store.state.timer === null){
         router.push("/timeSelector")
        // next(false)
      }else 
      {
      next()
    }
    }
  },
  {
    path: '/typingArticle',
    name: 'TypingPage',
    component: test,
    beforeEnter: (to,from,next)=>{
      if(store.state.typeOfWord === null){
        // next({path:'/1'}); 
        router.push("/1")
        // next({ name: 'SelectionPage1' })
      }
      else {
        next()
      }
    }
  },
  {
    path: '/typingWord',
    name: 'typeFast',
    component: test2,
    beforeEnter: (to,from,next)=>{
      if(store.state.typeOfWord === null){
        next({ name: 'SelectionPage1' })
      }else {
        // next({path:'/1'}); 
        next(); 
        // router.push("/1")
      }
    }
    
  },
  {
    path: '/test',
    name: 'test',
    component: test2
  },
  {
    path: '/result',
    name: 'result',
    component: result
  },
  {
    path: '/testing',
    name: 'testing',
    component: testing
  },
  {
    path: '/instruction',
    name: 'instruction',
    component: instruction
  },
  {
    path: '/aboutus',
    name: 'aboutus',
    component: aboutus
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
