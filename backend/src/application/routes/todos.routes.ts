import { Elysia, t } from 'elysia'
import { TodoRepository } from '../../infrastructure/repositories/TodoRepository'
import { GetTodos } from '../use-cases/GetTodos'
import { CreateTodo } from '../use-cases/CreateTodo'
import { ToggleTodo } from '../use-cases/ToggleTodo'
import { DeleteTodo } from '../use-cases/DeleteTodo'
import { requireAuth } from '../middleware/auth'

const handleError = (error: unknown, set: { status: number }, operation: string) => {
  const err = error as Error
  console.error(`${operation} error:`, err)

  const statusMap: Record<string, number> = {
    Unauthorized: 401,
    'Todo not found or unauthorized': 404,
  }

  set.status = statusMap[err.message] || 500
  return { error: err.message || `Failed to ${operation.toLowerCase()}` }
}

const parseTodoId = (id: string, set: { status: number }) => {
  const todoId = parseInt(id)
  if (isNaN(todoId)) {
    set.status = 400
    throw new Error('Invalid todo ID')
  }
  return todoId
}

export const todosRoutes = new Elysia({ prefix: '/todos' })
  .get('/', async ({ request, set }) => {
    try {
      const userId = requireAuth({ request })
      const todos = await new GetTodos(new TodoRepository()).execute(userId)
      return { todos }
    } catch (error) {
      return handleError(error, set, 'Get todos')
    }
  })
  .post(
    '/',
    async ({ request, body, set }) => {
      try {
        const userId = requireAuth({ request })
        const { title } = body

        if (!title?.trim()) {
          set.status = 400
          return { error: 'Title is required' }
        }

        const todo = await new CreateTodo(new TodoRepository()).execute(userId, title)
        return { todo }
      } catch (error) {
        return handleError(error, set, 'Create todo')
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
      const todoId = parseTodoId(params.id, set)
      const todo = await new ToggleTodo(new TodoRepository()).execute(todoId, userId)
      return { todo }
    } catch (error) {
      return handleError(error, set, 'Toggle todo')
    }
  })
  .delete('/:id', async ({ request, params, set }) => {
    try {
      const userId = requireAuth({ request })
      const todoId = parseTodoId(params.id, set)
      await new DeleteTodo(new TodoRepository()).execute(todoId, userId)
      return { success: true }
    } catch (error) {
      return handleError(error, set, 'Delete todo')
    }
  })
