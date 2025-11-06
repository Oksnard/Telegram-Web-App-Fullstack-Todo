import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTelegramStore = defineStore('telegram', () => {
  const isReady = ref(false)
  const initDataRaw = ref('')
  const webApp = ref<any>(null)

  const init = async () => {
    if (!window.Telegram?.WebApp) {
      throw new Error('Telegram WebApp not available')
    }

    webApp.value = window.Telegram.WebApp
    initDataRaw.value = webApp.value.initData

    if (!initDataRaw.value) {
      throw new Error('Telegram initData is empty')
    }

    webApp.value.ready()
    webApp.value.expand()

    isReady.value = true
  }

  return {
    isReady,
    initDataRaw,
    webApp,
    init,
  }
})
