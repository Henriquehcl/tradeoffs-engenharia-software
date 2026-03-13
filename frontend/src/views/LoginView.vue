<template>
  <v-app style="background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #1976D2 100%);">
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card rounded="xl" elevation="16" class="pa-6">
            <v-card-title class="text-h5 text-center font-weight-bold pb-1">
              Bem-vindo
            </v-card-title>
            <v-card-subtitle class="text-center pb-4">
              Faça login para continuar
            </v-card-subtitle>

            <v-divider class="mb-6" />

            <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                rounded="lg"
                :rules="emailRules"
                autocomplete="email"
                class="mb-3"
              />

              <v-text-field
                v-model="password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                rounded="lg"
                :rules="passwordRules"
                autocomplete="current-password"
                class="mb-4"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                rounded="lg"
                class="mb-4"
                density="compact"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                rounded="lg"
                :loading="isLoading"
                :disabled="!isValid"
              >
                <v-icon start>mdi-login</v-icon>
                Entrar
              </v-btn>
            </v-form>

            <v-divider class="my-4" />

            <p class="text-caption text-center text-medium-emphasis">
              <v-icon size="14">mdi-information-outline</v-icon>
              cliente@incuca.com.br | user@2026
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const isValid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const emailRules = [
  (v: string) => !!v || 'Email é obrigatório',
  (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
]

const passwordRules = [
  (v: string) => !!v || 'Senha é obrigatória',
  (v: string) => v.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
]

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/inicial')
  } catch (err: any) {
    const msg = err?.response?.data?.data?.message
      ?? err?.response?.data?.message
      ?? 'Credenciais inválidas. Verifique seu email e senha.'
    errorMessage.value = msg
  } finally {
    isLoading.value = false
  }
}
</script>
