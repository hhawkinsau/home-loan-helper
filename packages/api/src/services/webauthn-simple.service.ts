import { PrismaClient } from '@prisma/client'
import { SessionService } from './session.service'

// Simple WebAuthn service - to be implemented with correct API later
export class WebAuthnService {
  private prisma: PrismaClient
  private sessionService: SessionService

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.sessionService = new SessionService(prisma)
  }

  /**
   * Placeholder for WebAuthn registration - will implement with correct API
   */
  async generateRegistrationOptions(email?: string): Promise<any> {
    // For now, create user and return placeholder options
    let user;
    if (email) {
      user = await this.prisma.user.findUnique({ where: { email } })
      if (!user) {
        user = await this.prisma.user.create({ data: { email } })
      }
    } else {
      user = await this.prisma.user.create({ data: {} })
    }

    return {
      challenge: 'placeholder-challenge',
      rp: { name: 'Home Loan Helper', id: 'localhost' },
      user: {
        id: user.id,
        name: email || `user-${user.id.slice(-8)}`,
        displayName: email || `User ${user.id.slice(-8)}`
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      timeout: 60000,
      userId: user.id,
    }
  }

  /**
   * Placeholder for registration verification
   */
  async verifyRegistrationResponse(
    userId: string,
    response: any,
    expectedChallenge: string
  ): Promise<{ verified: boolean; sessionToken?: string }> {
    // For now, just create the session
    const session = await this.sessionService.createSession(userId)
    return {
      verified: true,
      sessionToken: session.token,
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId }
    })
  }

  /**
   * Get session service
   */
  getSessionService(): SessionService {
    return this.sessionService
  }
}
