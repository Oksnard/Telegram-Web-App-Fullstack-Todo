import { eq, and } from 'drizzle-orm'
import { db } from '../database/connection'
import { todos } from '../database/schema'
import { ITodoRepository } from '../../domain/repositories/ITodoRepository'
import { Todo, CreateTodoDto } from '../../domain/entities/Todo'

export class TodoRepository implements ITodoRepository {
  async findByUserId(userId: number): Promise<Todo[]> {
    const result = await db.select().from(todos).where(eq(todos.userId, userId))
    return result
  }

  async findById(id: number): Promise<Todo | null> {
    const result = await db.select().from(todos).where(eq(todos.id, id))
    return result[0] || null
  }

  async create(data: CreateTodoDto): Promise<Todo> {
    const result = await db
      .insert(todos)
      .values({
        userId: data.userId,
        title: data.title,
        completed: false,
      })
      .returning()

    return result[0]
  }

  async update(id: number, userId: number, completed: boolean): Promise<Todo | null> {
    const result = await db
      .update(todos)
      .set({ completed })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning()

    return result[0] || null
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning()

    return result.length > 0
  }
}
