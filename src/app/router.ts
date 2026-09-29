import { createRouter, createWebHistory } from 'vue-router'

import FeedView from '@/features/drawings/views/FeedView.vue'

export type TitleKey = 'feed.title' | 'draw.title' | 'profile.title' | 'notFound.title'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: TitleKey
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'feed',
      component: FeedView,
      meta: { titleKey: 'feed.title' },
    },
    {
      path: '/draw',
      name: 'draw',
      component: () => import('@/features/canvas/views/DrawView.vue'),
      meta: { titleKey: 'draw.title' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/features/drawings/views/ProfileView.vue'),
      meta: { titleKey: 'profile.title' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/app/views/NotFoundView.vue'),
      meta: { titleKey: 'notFound.title' },
    },
  ],
})
