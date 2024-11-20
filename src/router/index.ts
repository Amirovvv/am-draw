import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useAuth } from '@/composables/useAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true },
  },
  { path: '/', component: () => import('@/views/Gallery.vue') },
  {
    path: '/draw',
    component: () => import('@/views/Draw.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const { checkAuthState } = useAuth()

  await checkAuthState()

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.user) {
    next('/draw')
  } else {
    next()
  }
})

export default router
