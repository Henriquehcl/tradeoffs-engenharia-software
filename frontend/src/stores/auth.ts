import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

interface User {
  id: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  // Restore user from localStorage on startup
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('user')
    }
  }

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    // Handle both plain and wrapped (TransformInterceptor) responses
    const payload = response.data?.data ?? response.data
    const { access_token, user: userData } = payload

    token.value = access_token
    user.value = userData

    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
