import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTelegramStore } from '@/shared/stores/telegram'
import { apiClient } from '@/shared/api/client'

export interface User {
  id: number
  telegramId: number
  firstName: string | null
  lastName: string | null
  username: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const authenticate = async () => {
    try {
      const telegramStore = useTelegramStore()
      if (!telegramStore.initDataRaw) {
        throw new Error('Telegram initData is not available')
      }

      const { data } = await apiClient.post<{ user: User }>('/auth/telegram', {
        initData: telegramStore.initDataRaw,
      })

      if (data.user) {
        user.value = data.user
        isAuthenticated.value = true
        localStorage.setItem('userId', data.user.id.toString())
      }
    } catch (error) {
      console.error('Authentication error:', error)
      throw new Error('Не удалось выполнить аутентификацию')
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('userId')
  }

  return {
    user,
    isAuthenticated,
    authenticate,
    logout,
  }
})
