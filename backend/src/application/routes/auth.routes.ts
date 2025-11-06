import { Elysia, t } from 'elysia'
import { AuthenticateUser } from '../use-cases/AuthenticateUser'
import { UserRepository } from '../../infrastructure/repositories/UserRepository'
import { TelegramValidator } from '../../infrastructure/telegram/validator'

export const authRoutes = new Elysia({ prefix: '/auth' }).post(
  '/telegram',
  async ({ body, set }) => {
    try {
      const { initData } = body

      const botToken = process.env.TELEGRAM_BOT_TOKEN
      if (!botToken) {
        set.status = 500
        return { error: 'Bot token not configured' }
      }

      const user = await new AuthenticateUser(
        new UserRepository(),
        new TelegramValidator(botToken)
      ).execute(initData)

      if (!user) {
        set.status = 401
        return { error: 'Invalid Telegram data' }
      }

      const { id, telegramId, firstName, lastName, username } = user
      return { user: { id, telegramId, firstName, lastName, username } }
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
