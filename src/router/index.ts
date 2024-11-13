import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: () => import('@/views/Gallery.vue') },
  { path: '/draw', component: () => import('@/views/Drawing.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
