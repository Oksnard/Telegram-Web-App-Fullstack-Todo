import { ref } from 'vue'
import { useTodoStore } from '@/entities/todo/model/store'

export function useTodoDelete() {
  const isDeleting = ref(false)
  const error = ref('')

  const todoStore = useTodoStore()

  const deleteTodo = async (todoId: number) => {
    try {
      isDeleting.value = true
      error.value = ''

      await todoStore.deleteTodo(todoId)
    } catch (e: any) {
      error.value = e.response?.data?.error || 'Не удалось удалить задачу'
      throw e
    } finally {
      isDeleting.value = false
    }
  }

  return {
    isDeleting,
    error,
    deleteTodo,
  }
}
