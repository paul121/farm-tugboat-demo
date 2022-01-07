import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import CreatePreview from '../components/CreatePreview.vue'
import NotFound from '../components/NotFound.vue'

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
    path: '/demo/:id',
    name: 'Demo',
    component: CreatePreview,
  },
  {
    path: '/:pathMatch(.*)',
    component: NotFound,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
