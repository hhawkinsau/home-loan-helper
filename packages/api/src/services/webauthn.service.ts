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

export interface UserProfile {
  id: string
  email?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PasskeyInfo {
  id: string
  name?: string | null
  deviceType: string
  backedUp: boolean
  createdAt: Date
}

export class WebAuthnService {
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
    let user: UserProfile | null = null
    
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
   * Complete passkey registration
   */
  async verifyRegistrationResponse(
    userId: string,
    response: any,
    expectedChallenge: string,
    passkeyName?: string
  ): Promise<{ verified: boolean; sessionToken?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.config.origin,
      expectedRPID: this.config.rpID,
      requireUserVerification: true,
    })

    if (!verification.verified || !verification.registrationInfo) {
      return { verified: false }
    }

    const { registrationInfo } = verification
    
    // Store the passkey - using correct API properties
    await this.prisma.passkey.create({
      data: {
        userId: user.id,
        credentialId: Buffer.from(registrationInfo.credential.id).toString('base64'),
        publicKey: Buffer.from(registrationInfo.credential.publicKey).toString('base64'),
        counter: BigInt(registrationInfo.credential.counter),
        deviceType: registrationInfo.credentialDeviceType,
        backedUp: registrationInfo.credentialBackedUp,
        transports: JSON.stringify(response.response.transports || []),
      }
    })

    // Create session for the user
    const session = await this.sessionService.createSession(user.id)

    return {
      verified: true,
      sessionToken: session.token,
    }
  }

  /**
   * Start passkey authentication process
   */
  async generateAuthenticationOptions(): Promise<any> {
    // Get all passkeys (for usernameless authentication)
    const passkeys = await this.prisma.passkey.findMany()

    const allowCredentials = passkeys.map(passkey => ({
      id: passkey.credentialId,
      type: 'public-key' as const,
      transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
    }))

    const options = await generateAuthenticationOptions({
      rpID: this.config.rpID,
      allowCredentials,
      userVerification: 'preferred',
    })

    return options
  }

  /**
   * Complete passkey authentication
   */
  async verifyAuthenticationResponse(
    response: any,
    expectedChallenge: string
  ): Promise<{ verified: boolean; sessionToken?: string; user?: UserProfile }> {
    // Find the passkey
    const passkey = await this.prisma.passkey.findUnique({
      where: { credentialId: response.id },
      include: { user: true }
    })

    if (!passkey) {
      return { verified: false }
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.config.origin,
      expectedRPID: this.config.rpID,
      authenticator: {
        credentialID: Buffer.from(passkey.credentialId, 'base64'),
        credentialPublicKey: Buffer.from(passkey.publicKey, 'base64'),
        counter: Number(passkey.counter),
        transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
      },
      requireUserVerification: true,
    })

    if (!verification.verified) {
      return { verified: false }
    }

    // Update counter
    await this.prisma.passkey.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
      }
    })

    // Create session for the user
    const session = await this.sessionService.createSession(passkey.userId)

    return {
      verified: true,
      sessionToken: session.token,
      user: passkey.user,
    }
  }

  /**
   * Get user's passkeys
   */
  async getUserPasskeys(userId: string): Promise<PasskeyInfo[]> {
    const passkeys = await this.prisma.passkey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return passkeys.map(passkey => ({
      id: passkey.id,
      name: passkey.name,
      deviceType: passkey.deviceType,
      backedUp: passkey.backedUp,
      createdAt: passkey.createdAt,
    }))
  }

  /**
   * Delete a specific passkey
   */
  async deletePasskey(userId: string, passkeyId: string): Promise<boolean> {
    try {
      await this.prisma.passkey.delete({
        where: {
          id: passkeyId,
          userId, // Ensure user owns this passkey
        }
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId }
    })
  }

  /**
   * Get session service instance
   */
  getSessionService(): SessionService {
    return this.sessionService
  }
}
