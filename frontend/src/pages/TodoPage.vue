<template>
  <div class="todo-page min-h-screen p-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-tg-text mb-2">Мои задачи</h1>
      <p v-if="authStore.user" class="text-tg-hint">Привет, {{ authStore.user.firstName }}!</p>
    </header>

    <AddTodoForm />

    <div class="todos-list">
      <div v-if="todoStore.isLoading && todoStore.todos.length === 0" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-button mx-auto mb-2"></div>
        <p class="text-tg-hint">Загрузка задач...</p>
      </div>

      <div v-else-if="todoStore.todos.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p class="text-tg-hint">У вас пока нет задач</p>
        <p class="text-tg-hint text-sm mt-1">Добавьте первую задачу выше</p>
      </div>

      <div v-else>
        <TodoItem
          v-for="todo in todoStore.todos"
          :key="todo.id"
          :todo="todo"
          @toggle="handleToggleTodo"
          @delete="handleDeleteTodo"
        />
      </div>

      <div v-if="todoStore.error" class="bg-red-50 text-red-600 p-4 rounded-lg mt-4">
        {{ todoStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/entities/auth/model/store'
import { useTodoStore } from '@/entities/todo/model/store'
import { useTodoDelete } from '@/features/delete-todo/model/useTodoDelete'
import AddTodoForm from '@/features/add-todo/ui/AddTodoForm.vue'
import TodoItem from '@/entities/todo/ui/TodoItem.vue'

const authStore = useAuthStore()
const todoStore = useTodoStore()
const { deleteTodo } = useTodoDelete()

onMounted(async () => {
  try {
    await todoStore.fetchTodos()
  } catch (error) {
    console.error('Failed to load todos:', error)
  }
})

const handleToggleTodo = (todoId: number) => {
  todoStore.toggleTodo(todoId).catch((error) => {
    console.error('Failed to toggle todo:', error)
  })
}

const handleDeleteTodo = (todoId: number) => {
  deleteTodo(todoId).catch((error) => {
    console.error('Failed to delete todo:', error)
  })
}
</script>
