<template>
  <div class="mood-screen feliz-bg">
    <div class="mood-face bounce">:)</div>
    <div class="mood-label">Que piada incrível!</div>
    <div class="mood-hint">feche o modal para recomeçar</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMoodStore } from '@/stores/mood'

const moodStore = useMoodStore()

onMounted(() => {
  // Enable the close button now that we are on the happy screen
  moodStore.enableClose()
})
</script>

<style scoped>
.feliz-bg {
  background: linear-gradient(135deg, #F57F17, #FFA000, #FFD54F);
  color: #3E2723;
  cursor: default;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-16px); }
}

.bounce {
  animation: bounce 0.9s ease-in-out infinite;
}
</style>
