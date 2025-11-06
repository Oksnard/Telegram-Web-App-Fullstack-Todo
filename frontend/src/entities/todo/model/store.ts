import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/shared/api/client'
import type { Todo, CreateTodoDto } from './types'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const error = ref('')

  const fetchTodos = async () => {
    try {
      isLoading.value = true
      error.value = ''

      const response = await apiClient.get('/todos')
      todos.value = response.data.todos || []
    } catch (e: any) {
      console.error('Fetch todos error:', e)
      error.value = 'Не удалось загрузить задачи'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const createTodo = async (data: CreateTodoDto) => {
    try {
      isLoading.value = true
      error.value = ''

      const response = await apiClient.post('/todos', data)

      if (response.data.todo) {
        todos.value.unshift(response.data.todo)
      }

      return response.data.todo
    } catch (e: any) {
      console.error('Create todo error:', e)
      error.value = 'Не удалось создать задачу'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const toggleTodo = async (todoId: number) => {
    try {
      const response = await apiClient.patch(`/todos/${todoId}/toggle`)

      if (response.data.todo) {
        const index = todos.value.findIndex((t) => t.id === todoId)
        if (index !== -1) {
          todos.value[index] = response.data.todo
        }
      }
    } catch (e: any) {
      console.error('Toggle todo error:', e)
      error.value = 'Не удалось обновить задачу'
      throw e
    }
  }

  const deleteTodo = async (todoId: number) => {
    try {
      isLoading.value = true
      error.value = ''

      await apiClient.delete(`/todos/${todoId}`)
      todos.value = todos.value.filter((todo) => todo.id !== todoId)
    } catch (e: any) {
      console.error('Delete todo error:', e)
      error.value = 'Не удалось удалить задачу'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    toggleTodo,
    deleteTodo,
  }
})
