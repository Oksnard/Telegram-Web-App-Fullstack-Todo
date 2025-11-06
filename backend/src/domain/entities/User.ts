export interface User {
  id: number
  telegramId: number
  firstName: string | null
  lastName: string | null
  username: string | null
  createdAt: Date
}

export interface CreateUserDto {
  telegramId: number
  firstName?: string
  lastName?: string
  username?: string
}
