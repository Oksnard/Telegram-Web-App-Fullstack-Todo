import { Elysia, t } from 'elysia'
import { TodoRepository } from '../../infrastructure/repositories/TodoRepository'
import { GetTodos } from '../use-cases/GetTodos'
import { CreateTodo } from '../use-cases/CreateTodo'
import { ToggleTodo } from '../use-cases/ToggleTodo'
import { DeleteTodo } from '../use-cases/DeleteTodo'
import { requireAuth } from '../middleware/auth'

export const todosRoutes = new Elysia({ prefix: '/todos' })
  .get('/', async ({ request, set }) => {
    try {
      const userId = requireAuth({ request })

      const todoRepository = new TodoRepository()
      const getTodos = new GetTodos(todoRepository)

      const todos = await getTodos.execute(userId)

      return { todos }
    } catch (error: any) {
      console.error('Get todos error:', error)
      set.status = error.message === 'Unauthorized' ? 401 : 500
      return { error: error.message || 'Failed to get todos' }
    }
  })

  .post(
    '/',
    async ({ request, body, set }) => {
      try {
        const userId = requireAuth({ request })
        const { title } = body as { title: string }

        if (!title || title.trim().length === 0) {
          set.status = 400
          return { error: 'Title is required' }
        }

        const todoRepository = new TodoRepository()
        const createTodo = new CreateTodo(todoRepository)

        const todo = await createTodo.execute(userId, title)

        return { todo }
      } catch (error: any) {
        console.error('Create todo error:', error)
        set.status = error.message === 'Unauthorized' ? 401 : 500
        return { error: error.message || 'Failed to create todo' }
      }
    },
    {
      body: t.Object({
        title: t.String(),
      }),
    }
  )

  .patch('/:id/toggle', async ({ request, params, set }) => {
    try {
      const userId = requireAuth({ request })
      const todoId = parseInt(params.id)

      if (isNaN(todoId)) {
        set.status = 400
        return { error: 'Invalid todo ID' }
      }

      const todoRepository = new TodoRepository()
      const toggleTodo = new ToggleTodo(todoRepository)

      const todo = await toggleTodo.execute(todoId, userId)

      return { todo }
    } catch (error: any) {
      console.error('Toggle todo error:', error)

      if (error.message === 'Unauthorized' || error.message === 'Todo not found or unauthorized') {
        set.status = 404
      } else {
        set.status = 500
      }

      return { error: error.message || 'Failed to toggle todo' }
    }
  })

  .delete('/:id', async ({ request, params, set }) => {
    try {
      const userId = requireAuth({ request })
      const todoId = parseInt(params.id)

      if (isNaN(todoId)) {
        set.status = 400
        return { error: 'Invalid todo ID' }
      }

      const todoRepository = new TodoRepository()
      const deleteTodo = new DeleteTodo(todoRepository)

      await deleteTodo.execute(todoId, userId)

      return { success: true }
    } catch (error: any) {
      console.error('Delete todo error:', error)

      if (error.message === 'Unauthorized') {
        set.status = 401
      } else if (error.message === 'Todo not found or unauthorized') {
        set.status = 404
      } else {
        set.status = 500
      }

      return { error: error.message || 'Failed to delete todo' }
    }
  })
