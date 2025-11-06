import { pgTable, serial, text, integer, boolean, timestamp, bigint } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  telegramId: bigint('telegram_id', { mode: 'number' }).notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  username: text('username'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
