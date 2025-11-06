export interface AuthContext {
  request: Request
}

export function extractUserId(context: AuthContext): number | null {
  const userIdHeader = context.request.headers.get('x-user-id')

  if (userIdHeader) {
    const userId = parseInt(userIdHeader)
    if (!isNaN(userId)) {
      return userId
    }
  }

  return null
}

export function requireAuth(context: AuthContext): number {
  const userId = extractUserId(context)

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}
