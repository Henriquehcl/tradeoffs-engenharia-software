<template>
  <div class="mood-screen poker-bg">
    <div class="mood-face">:-|</div>
    <div class="mood-label">Hmm... deixa eu pensar...</div>
    <div class="mood-hint">lendo a piada...</div>
    <v-progress-linear
      :model-value="progress"
      color="amber"
      bg-color="rgba(255,255,255,0.2)"
      height="4"
      class="progress-bar"
      rounded
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMoodStore } from '@/stores/mood'

const router = useRouter()
const moodStore = useMoodStore()

const progress = ref(0)
const DURATION = 4000 // ms before transitioning to /feliz

let interval: ReturnType<typeof setInterval>
let timeout: ReturnType<typeof setTimeout>

onMounted(() => {
  const start = Date.now()

  interval = setInterval(() => {
    const elapsed = Date.now() - start
    progress.value = Math.min((elapsed / DURATION) * 100, 100)
  }, 50)

  timeout = setTimeout(() => {
    clearInterval(interval)
    router.push('/feliz')
  }, DURATION)
})

onUnmounted(() => {
  clearInterval(interval)
  clearTimeout(timeout)
})
</script>

<style scoped>
.poker-bg {
  background: linear-gradient(135deg, #5C6BC0, #7E57C2);
  color: #E8EAF6;
  cursor: default;
  position: relative;
}

.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 !important;
}
</style>
