<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Joke modal lives here to persist across /poker-face → /feliz transition -->
    <JokeModal />
  </v-app>
</template>

<script setup lang="ts">
import JokeModal from '@/components/JokeModal.vue'
</script>
