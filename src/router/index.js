import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CreatePreview from '../components/CreatePreview.vue'
import NotFound from '../components/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/demo/:alias',
    name: 'demo-alias',
    component: CreatePreview,
  },
  {
    path: '/demo/id/:id([a-z\\|\\d]{24})',
    name: 'demo-id',
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
