import { PrismaClient } from '@prisma/client'
import { 
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import { SessionService } from './session.service'

export interface WebAuthnConfig {
  rpName: string
  rpID: string
  origin: string
}

export class SimpleWebAuthnService {
  private prisma: PrismaClient
  private sessionService: SessionService
  private config: WebAuthnConfig

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.sessionService = new SessionService(prisma)
    this.config = {
      rpName: process.env.WEBAUTHN_RP_NAME || 'Home Loan Helper',
      rpID: process.env.WEBAUTHN_RP_ID || 'localhost',
      origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173',
    }
  }

  /**
   * Start passkey registration process
   */
  async generateRegistrationOptions(email?: string): Promise<any> {
    let user = null
    
    // If email provided, find or create user
    if (email) {
      user = await this.prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        user = await this.prisma.user.create({
          data: { email }
        })
      }
    } else {
      // Create anonymous user
      user = await this.prisma.user.create({
        data: {}
      })
    }

    // Get existing passkeys for this user
    const existingPasskeys = await this.prisma.passkey.findMany({
      where: { userId: user.id }
    })

    const excludeCredentials = existingPasskeys.map(passkey => ({
      id: passkey.credentialId,
      type: 'public-key' as const,
      transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
    }))

    const options = await generateRegistrationOptions({
      rpName: this.config.rpName,
      rpID: this.config.rpID,
      userID: new TextEncoder().encode(user.id),
      userName: email || `user-${user.id.slice(-8)}`,
      userDisplayName: email || `User ${user.id.slice(-8)}`,
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    })

    return {
      ...options,
      userId: user.id,
    }
  }

  /**
   * Get session service instance
   */
  getSessionService(): SessionService {
    return this.sessionService
  }
}
