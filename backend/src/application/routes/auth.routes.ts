import { Elysia, t } from 'elysia'
import { AuthenticateUser } from '../use-cases/AuthenticateUser'
import { UserRepository } from '../../infrastructure/repositories/UserRepository'
import { TelegramValidator } from '../../infrastructure/telegram/validator'

export const authRoutes = new Elysia({ prefix: '/auth' }).post(
  '/telegram',
  async ({ body, set }) => {
    try {
      const { initData } = body as { initData: string }

      if (!initData) {
        set.status = 400
        return { error: 'initData is required' }
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN
      if (!botToken) {
        set.status = 500
        return { error: 'Bot token not configured' }
      }

      const telegramValidator = new TelegramValidator(botToken)
      const userRepository = new UserRepository()
      const authenticateUser = new AuthenticateUser(userRepository, telegramValidator)

      const user = await authenticateUser.execute(initData)

      if (!user) {
        set.status = 401
        return { error: 'Invalid Telegram data' }
      }

      return {
        user: {
          id: user.id,
          telegramId: user.telegramId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        },
      }
    } catch (error) {
      console.error('Auth error:', error)
      set.status = 500
      return { error: 'Authentication failed' }
    }
  },
  {
    body: t.Object({
      initData: t.String(),
    }),
  }
)
