import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMoodStore } from '@/stores/mood'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/inicial',
    component: () => import('@/views/InicialView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/triste',
    component: () => import('@/views/TristeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/poker-face',
    component: () => import('@/views/PokerFaceView.vue'),
    meta: { requiresAuth: true, requiresJoke: true },
  },
  {
    path: '/feliz',
    component: () => import('@/views/FelizView.vue'),
    meta: { requiresAuth: true, requiresJoke: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const moodStore = useMoodStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return '/inicial'
  }

  // Prevent direct navigation to joke-dependent routes without a joke
  if (to.meta.requiresJoke && !moodStore.joke) {
    return '/inicial'
  }
})

export default router
