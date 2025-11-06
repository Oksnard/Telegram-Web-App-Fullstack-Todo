<template>
  <div class="app min-h-screen bg-tg-bg text-tg-text">
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-tg-button mx-auto mb-4"></div>
        <p class="text-tg-hint">Загрузка...</p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <div class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button class="bg-tg-button text-tg-button-text px-4 py-2 rounded-lg" @click="retry">Попробовать снова</button>
      </div>
    </div>

    <TodoPage v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTelegramStore } from '@/shared/stores/telegram'
import { useAuthStore } from '@/entities/auth/model/store'
import TodoPage from '@/pages/TodoPage.vue'

const isLoading = ref(true)
const error = ref('')

const telegramStore = useTelegramStore()
const authStore = useAuthStore()

const init = async () => {
  try {
    isLoading.value = true
    error.value = ''

    await telegramStore.init()
    await authStore.authenticate()

    isLoading.value = false
  } catch (e: any) {
    console.error('Initialization error:', e)
    error.value = e.message || 'Не удалось инициализировать приложение'
    isLoading.value = false
  }
}

const retry = () => {
  init()
}

onMounted(() => {
  init()
})
</script>
