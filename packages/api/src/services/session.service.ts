import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

export interface SessionData {
  id: string
  token: string
  userId: string
  expiresAt: Date
  createdAt: Date
  lastUsed: Date
}

export class SessionService {
  private prisma: PrismaClient
  private readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in ms

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * Create a new server session for the user
   */
  async createSession(userId: string): Promise<SessionData> {
    // Generate cryptographically secure random token
    const token = randomBytes(32).toString('base64url')
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)

    const session = await this.prisma.serverSession.create({
      data: {
        token,
        userId,
        expiresAt,
      }
    })

    return {
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastUsed: session.lastUsed,
    }
  }

  /**
   * Validate session token and return session data
   */
  async validateSession(token: string): Promise<SessionData | null> {
    const session = await this.prisma.serverSession.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session) return null

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await this.deleteSession(token)
      return null
    }

    // Update last used timestamp
    await this.prisma.serverSession.update({
      where: { id: session.id },
      data: { lastUsed: new Date() }
    })

    return {
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastUsed: new Date(),
    }
  }

  /**
   * Delete a specific session
   */
  async deleteSession(token: string): Promise<void> {
    await this.prisma.serverSession.delete({
      where: { token }
    }).catch(() => {
      // Session might not exist, ignore error
    })
  }

  /**
   * Delete all sessions for a user (logout from all devices)
   */
  async deleteUserSessions(userId: string): Promise<void> {
    await this.prisma.serverSession.deleteMany({
      where: { userId }
    })
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.serverSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    return result.count
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    const sessions = await this.prisma.serverSession.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: { lastUsed: 'desc' }
    })

    return sessions.map(session => ({
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastUsed: session.lastUsed,
    }))
  }
}
