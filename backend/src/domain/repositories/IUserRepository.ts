import { User, CreateUserDto } from '../entities/User'

export interface IUserRepository {
  findByTelegramId(telegramId: number): Promise<User | null>
  create(data: CreateUserDto): Promise<User>
  findOrCreate(data: CreateUserDto): Promise<User>
}
