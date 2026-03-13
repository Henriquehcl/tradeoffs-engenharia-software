import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useMoodStore = defineStore('mood', () => {
  const joke = ref<string | null>(null)
  const showModal = ref(false)
  const canClose = ref(false)
  const isLoading = ref(false)

  async function fetchJoke() {
    isLoading.value = true
    try {
      const response = await api.get('/jokes')
      // Handle both plain and wrapped (TransformInterceptor) responses
      const payload = response.data?.data ?? response.data
      joke.value = payload.joke
      showModal.value = true
      canClose.value = false
    } finally {
      isLoading.value = false
    }
  }

  function enableClose() {
    canClose.value = true
  }

  function closeModal() {
    showModal.value = false
    joke.value = null
    canClose.value = false
  }

  return { joke, showModal, canClose, isLoading, fetchJoke, enableClose, closeModal }
})
