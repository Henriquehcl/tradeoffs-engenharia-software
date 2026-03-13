<template>
  <div class="mood-screen inicial-bg" @click="handleClick">
    <div class="mood-face">:|</div>
    <div class="mood-label">Como vai?</div>
    <div class="mood-hint">clique em qualquer lugar para continuar</div>

    <v-btn
      variant="text"
      color="white"
      size="small"
      class="logout-btn"
      @click.stop="handleLogout"
    >
      <v-icon start size="16">mdi-logout</v-icon>
      Sair
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleClick() {
  router.push('/triste')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.inicial-bg {
  background: linear-gradient(135deg, #546E7A, #607D8B);
  color: #ECEFF1;
  position: relative;
}

.logout-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  opacity: 0.7;
}
.logout-btn:hover {
  opacity: 1;
}
</style>
