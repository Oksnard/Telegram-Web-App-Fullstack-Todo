import crypto from 'crypto'

export interface TelegramInitData {
  query_id?: string
  user?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
  }
  auth_date: number
  hash: string
}

export class TelegramValidator {
  private botToken: string

  constructor(botToken: string) {
    this.botToken = botToken
  }

  validate(initData: string): TelegramInitData | null {
    try {
      const parsed = this.parseInitData(initData)

      if (!this.verifyHash(initData, parsed.hash)) {
        console.error('Invalid hash')
        return null
      }

      const authDate = parsed.auth_date
      const currentTime = Math.floor(Date.now() / 1000)
      const timeDiff = currentTime - authDate

      if (timeDiff > 86400) {
        console.error('Auth data is too old')
        return null
      }

      return parsed
    } catch (error) {
      console.error('Validation error:', error)
      return null
    }
  }

  private parseInitData(initData: string): TelegramInitData {
    const params = new URLSearchParams(initData)
    const data: any = {}

    for (const [key, value] of params.entries()) {
      if (key === 'user') {
        data[key] = JSON.parse(value)
      } else if (key === 'auth_date') {
        data[key] = parseInt(value)
      } else {
        data[key] = value
      }
    }

    return data as TelegramInitData
  }

  private verifyHash(initData: string, receivedHash: string): boolean {
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(this.botToken).digest()

    const params = new URLSearchParams(initData)
    params.delete('hash')

    const dataCheckString = Array.from(params.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    return calculatedHash === receivedHash
  }
}
