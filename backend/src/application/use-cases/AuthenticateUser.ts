import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User } from '../../domain/entities/User'
import { TelegramValidator } from '../../infrastructure/telegram/validator'

export class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private telegramValidator: TelegramValidator
  ) {}

  async execute(initData: string): Promise<User | null> {
    const validatedData = this.telegramValidator.validate(initData)

    if (!validatedData || !validatedData.user) {
      return null
    }

    const user = await this.userRepository.findOrCreate({
      telegramId: validatedData.user.id,
      firstName: validatedData.user.first_name,
      lastName: validatedData.user.last_name,
      username: validatedData.user.username,
    })

    return user
  }
}
