import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { authRoutes } from './application/routes/auth.routes'
import { todosRoutes } from './application/routes/todos.routes'

const app = new Elysia()
  .use(
    cors({
      origin: (req) => {
        const origin = req.headers.get('origin')
        if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
          return origin
        }
        return process.env.FRONTEND_URL || 'http://localhost:5174'
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

    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: 'Route not found' }
    }

    if (code === 'VALIDATION') {
      set.status = 400
      return { error: 'Validation error', details: error.message }
    }

    set.status = 500
    return { error: 'Internal server error' }
  })

  .listen(process.env.PORT || 3000)

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`)
