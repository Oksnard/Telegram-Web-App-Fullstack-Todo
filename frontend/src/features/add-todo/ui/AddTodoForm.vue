<template>
  <div class="add-todo-form mb-6">
    <form class="flex gap-2" @submit.prevent="handleSubmit">
      <input
        v-model="title"
        type="text"
        placeholder="Введите название задачи..."
        class="flex-1 px-4 py-3 rounded-lg bg-tg-secondary-bg text-tg-text placeholder-tg-hint border-none outline-none focus:ring-2 focus:ring-tg-button"
        :disabled="isSubmitting"
      />

      <button
        type="submit"
        :disabled="!title.trim() || isSubmitting"
        class="px-6 py-3 bg-tg-button text-tg-button-text rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {{ isSubmitting ? '...' : 'Добавить' }}
      </button>
    </form>

    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/entities/todo/model/store'

const title = ref('')
const isSubmitting = ref(false)
const error = ref('')

const todoStore = useTodoStore()

const handleSubmit = async () => {
  if (!title.value.trim() || isSubmitting.value) return

  try {
    isSubmitting.value = true
    error.value = ''
    await todoStore.createTodo({ title: title.value.trim() })
    title.value = ''
  } catch (e) {
    const axiosError = e as { response?: { data?: { error?: string } } }
    error.value = axiosError.response?.data?.error || 'Не удалось добавить задачу'
  } finally {
    isSubmitting.value = false
  }
}
</script>
