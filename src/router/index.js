import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import CreatePreview from '../components/CreatePreview.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/demo',
    name: 'Demo',
    component: CreatePreview,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
