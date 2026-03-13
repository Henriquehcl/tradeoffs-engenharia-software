<template>
  <v-dialog
    v-model="moodStore.showModal"
    max-width="560"
    persistent
  >
    <v-card class="joke-card" rounded="xl" elevation="12">
      <v-card-title class="text-h6 pa-6 pb-2 d-flex align-center ga-2">
        <v-icon color="amber-darken-2" size="28">mdi-robot-happy</v-icon>
        Piada Geek para alegrar seu dia
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <p v-if="moodStore.joke" class="text-body-1 joke-text">
          {{ moodStore.joke }}
        </p>
        <v-skeleton-loader v-else type="paragraph" />
      </v-card-text>

      <v-card-actions class="pa-6 pt-0 justify-end">
        <v-tooltip
          :text="moodStore.canClose ? '' : 'Aguarde a tela ficar feliz para fechar...'"
          location="top"
        >
          <template #activator="{ props }">
            <span v-bind="props">
              <v-btn
                color="success"
                variant="elevated"
                rounded="lg"
                :disabled="!moodStore.canClose"
                @click="handleClose"
              >
                <v-icon start>mdi-emoticon-happy-outline</v-icon>
                {{ moodStore.canClose ? 'Fechar e voltar ao início' : 'Aguardando...' }}
              </v-btn>
            </span>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useMoodStore } from '@/stores/mood'
import { useRouter } from 'vue-router'

const moodStore = useMoodStore()
const router = useRouter()

function handleClose() {
  moodStore.closeModal()
  router.push('/inicial')
}
</script>

<style scoped>
.joke-card {
  border-top: 4px solid #FFA000;
}

.joke-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #333;
  font-style: italic;
}
</style>
