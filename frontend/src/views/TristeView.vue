<template>
  <div class="mood-screen triste-bg" @click="handleClick">
    <v-overlay v-model="moodStore.isLoading" contained class="align-center justify-center">
      <v-progress-circular color="white" indeterminate size="64" />
      <p class="text-white mt-4 text-body-1">Buscando piada...</p>
    </v-overlay>

    <div class="mood-face">:(</div>
    <div class="mood-label">Que tristeza...</div>
    <div class="mood-hint">
      {{ moodStore.isLoading ? 'Buscando uma piada...' : 'clique para buscar uma piada' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMoodStore } from '@/stores/mood'

const router = useRouter()
const moodStore = useMoodStore()

async function handleClick() {
  if (moodStore.isLoading) return

  await moodStore.fetchJoke()
  router.push('/poker-face')
}
</script>

<style scoped>
.triste-bg {
  background: linear-gradient(135deg, #37474F, #455A64);
  color: #CFD8DC;
}
</style>
