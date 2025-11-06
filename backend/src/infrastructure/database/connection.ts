import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/todo_miniapp'

let client: ReturnType<typeof postgres>
let db: ReturnType<typeof drizzle>

try {
  client = postgres(connectionString, {
    onnotice: () => {},
    connection: {
      application_name: 'todo_miniapp_backend',
    },
  })
  db = drizzle(client, { schema })
  console.log('Database connection initialized')
} catch (error) {
  console.error('Failed to initialize database connection:', error)
  throw error
}

export { client, db }
