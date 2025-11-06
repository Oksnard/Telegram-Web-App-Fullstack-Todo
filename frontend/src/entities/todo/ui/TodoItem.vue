<template>
  <div class="todo-item bg-tg-secondary-bg rounded-lg p-4 mb-3 flex items-center justify-between shadow-sm">
    <div class="flex items-center flex-1 gap-3">
      <button
        class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
        :class="todo.completed ? 'bg-tg-button border-tg-button' : 'border-tg-hint'"
        @click="handleToggle"
      >
        <svg v-if="todo.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div class="flex-1">
        <p class="text-tg-text" :class="{ 'line-through opacity-50': todo.completed }">
          {{ todo.title }}
        </p>
        <p class="text-xs text-tg-hint mt-1">{{ formattedDate }}</p>
      </div>
    </div>

    <button
      :disabled="isDeleting"
      class="ml-4 text-red-500 hover:text-red-600 disabled:opacity-50 p-2"
      title="Удалить"
      @click="handleDelete"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Todo } from '../model/types'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  delete: [id: number]
  toggle: [id: number]
}>()

const isDeleting = ref(false)

const formattedDate = computed(() => {
  const date = new Date(props.todo.createdAt)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const handleToggle = () => {
  emit('toggle', props.todo.id)
}

const handleDelete = async () => {
  if (isDeleting.value) return

  isDeleting.value = true
  try {
    emit('delete', props.todo.id)
  } finally {
    isDeleting.value = false
  }
}
</script>
