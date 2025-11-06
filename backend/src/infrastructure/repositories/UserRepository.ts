import { eq } from 'drizzle-orm'
import { db } from '../database/connection'
import { users } from '../database/schema'
import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User, CreateUserDto } from '../../domain/entities/User'

export class UserRepository implements IUserRepository {
  async findByTelegramId(telegramId: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.telegramId, telegramId))
    return result[0] || null
  }

  async create(data: CreateUserDto): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        telegramId: data.telegramId,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        username: data.username || null,
      })
      .returning()

    return result[0]
  }

  async findOrCreate(data: CreateUserDto): Promise<User> {
    const existingUser = await this.findByTelegramId(data.telegramId)

    if (existingUser) {
      return existingUser
    }

    return await this.create(data)
  }
}
