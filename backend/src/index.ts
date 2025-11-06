import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './application/routes/auth.routes'
import { todosRoutes } from './application/routes/todos.routes'

const app = new Elysia()
  .use(
    cors({
      origin: (req) => {
        const origin = req.headers.get('origin')
        return origin?.includes('localhost') || origin?.includes('127.0.0.1')
          ? origin
          : process.env.FRONTEND_URL || 'http://localhost:5174'
      },
      credentials: true,
    })
  )
  .get('/', () => ({
    message: 'Todo Telegram Mini App API',
    version: '1.0.0',
  }))
  .use(authRoutes)
  .use(todosRoutes)
  .onError(({ code, error, set }) => {
    console.error('Error:', code, error)

    const statusMap: Record<string, number> = {
      NOT_FOUND: 404,
      VALIDATION: 400,
    }

    set.status = statusMap[code] || 500

    return {
      error:
        code === 'NOT_FOUND'
          ? 'Route not found'
          : code === 'VALIDATION'
            ? 'Validation error'
            : 'Internal server error',
      ...(code === 'VALIDATION' && { details: error.message }),
    }
  })
  .listen(process.env.PORT || 3000)

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`)
