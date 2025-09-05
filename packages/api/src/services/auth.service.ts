import { PrismaClient } from '@prisma/client'
import { 
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server'
import { getEncryptionService } from './encryption.service'
import { 
  UserProfile, 
  CreateUserRequest, 
  PasskeyRegistrationRequest,
  PasskeyAuthenticationRequest 
} from '../types'

export class AuthService {
  private prisma: PrismaClient
  private encryptionService = getEncryptionService()

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // WebAuthn configuration
  private getWebAuthnConfig() {
    return {
      rpName: process.env.WEBAUTHN_RP_NAME || 'Home Loan Helper',
      rpID: process.env.WEBAUTHN_RP_ID || 'localhost',
      origin: process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173',
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<UserProfile> {
    const encryptedData = userData.encryptedData 
      ? this.encryptionService.encrypt(userData.encryptedData)
      : null

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        encryptedData,
      }
    })

    return {
      id: user.id,
      email: user.email,
      username: user.username || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      username: user.username || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Get user's encrypted data
   */
  async getUserData(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.encryptedData) return null

    try {
      const decryptedData = this.encryptionService.decrypt(user.encryptedData)
      return JSON.parse(decryptedData)
    } catch {
      return null
    }
  }

  /**
   * Update user's encrypted data
   */
  async updateUserData(userId: string, data: any): Promise<void> {
    const encryptedData = this.encryptionService.encrypt(JSON.stringify(data))
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { encryptedData }
    })
  }

  /**
   * Generate passkey registration options
   */
  async generatePasskeyRegistration(request: PasskeyRegistrationRequest) {
    const { email, username } = request
    const config = this.getWebAuthnConfig()

    // Check if user exists, create if not
    let user = await this.findUserByEmail(email)
    if (!user) {
      user = await this.createUser({ email, username })
    }

    // Get existing passkeys for this user
    const existingPasskeys = await this.prisma.passkey.findMany({
      where: { userId: user.id }
    })

    const options = await generateRegistrationOptions({
      rpName: config.rpName,
      rpID: config.rpID,
      userID: Buffer.from(user.id),
      userName: email,
      userDisplayName: username || email,
      attestationType: 'none',
      excludeCredentials: existingPasskeys.map(passkey => ({
        id: passkey.credentialId,
        type: 'public-key' as const,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    })

    // Store challenge temporarily (in production, use Redis or database)
    // For now, we'll return it to the client and expect it back
    return {
      options,
      userId: user.id,
    }
  }

  /**
   * Verify passkey registration
   */
  async verifyPasskeyRegistration(
    userId: string,
    response: any,
    expectedChallenge: string
  ) {
    const config = this.getWebAuthnConfig()

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
    })

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo

      // Save the passkey
      await this.prisma.passkey.create({
        data: {
          userId,
          credentialId: credential.id,
          publicKey: Buffer.from(credential.publicKey).toString('base64'),
          counter: BigInt(credential.counter),
          deviceType: 'unknown', // Could be enhanced with device detection
          backedUp: false,
          transports: JSON.stringify(response.response?.transports || []),
        }
      })
    }

    return verification
  }

  /**
   * Generate passkey authentication options
   */
  async generatePasskeyAuthentication(request: PasskeyAuthenticationRequest) {
    const { email } = request
    const config = this.getWebAuthnConfig()

    const user = await this.findUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const passkeys = await this.prisma.passkey.findMany({
      where: { userId: user.id }
    })

    if (passkeys.length === 0) {
      throw new Error('No passkeys registered for this user')
    }

    const options = await generateAuthenticationOptions({
      rpID: config.rpID,
      allowCredentials: passkeys.map(passkey => ({
        id: passkey.credentialId,
        type: 'public-key' as const,
        transports: JSON.parse(passkey.transports || '[]'),
      })),
      userVerification: 'preferred',
    })

    return {
      options,
      userId: user.id,
    }
  }

  /**
   * Verify passkey authentication
   */
  async verifyPasskeyAuthentication(
    userId: string,
    response: any,
    expectedChallenge: string
  ) {
    const config = this.getWebAuthnConfig()

    const credentialID = response.id
    
    const passkey = await this.prisma.passkey.findUnique({
      where: { 
        credentialId: credentialID
      }
    })

    if (!passkey) {
      throw new Error('Passkey not found')
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
      credential: {
        id: passkey.credentialId,
        publicKey: Buffer.from(passkey.publicKey, 'base64'),
        counter: Number(passkey.counter),
      },
    })

    if (verification.verified) {
      // Update counter
      await this.prisma.passkey.update({
        where: { id: passkey.id },
        data: { counter: BigInt(verification.authenticationInfo.newCounter) }
      })
    }

    return verification
  }

  /**
   * Create session
   */
  async createSession(userId: string, token: string, expiresAt: Date) {
    return await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      }
    })
  }

  /**
   * Revoke session
   */
  async revokeSession(token: string) {
    await this.prisma.session.delete({
      where: { token }
    })
  }

  /**
   * Clean expired sessions
   */
  async cleanExpiredSessions() {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }
}
