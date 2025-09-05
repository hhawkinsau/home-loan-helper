import request from 'supertest'
import { AuthService } from '../src/services/auth.service'
import { getEncryptionService } from '../src/services/encryption.service'
import { prisma } from './setup'

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService(prisma)
  })

  describe('User Management', () => {
    test('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        encryptedData: JSON.stringify({ preference: 'test' })
      }

      const user = await authService.createUser(userData)

      expect(user.email).toBe(userData.email)
      expect(user.username).toBe(userData.username)
      expect(user.id).toBeDefined()
      expect(user.createdAt).toBeDefined()
    })

    test('should find user by email', async () => {
      // Create user first
      await authService.createUser({
        email: 'find@example.com',
        username: 'finduser'
      })

      const user = await authService.findUserByEmail('find@example.com')
      expect(user).toBeTruthy()
      expect(user?.email).toBe('find@example.com')
    })

    test('should return null for non-existent user', async () => {
      const user = await authService.findUserByEmail('nonexistent@example.com')
      expect(user).toBeNull()
    })
  })

  describe('Data Encryption', () => {
    test('should encrypt and decrypt user data', async () => {
      const testData = { loanAmount: 500000, preferences: { term: 30 } }
      
      const user = await authService.createUser({
        email: 'encrypt@example.com',
        username: 'encryptuser',
        encryptedData: JSON.stringify(testData)
      })

      // Get the decrypted data
      const decryptedData = await authService.getUserData(user.id)
      expect(decryptedData).toEqual(testData)
    })

    test('should update encrypted user data', async () => {
      const user = await authService.createUser({
        email: 'update@example.com',
        username: 'updateuser'
      })

      const newData = { loanAmount: 750000, term: 25 }
      await authService.updateUserData(user.id, newData)

      const retrievedData = await authService.getUserData(user.id)
      expect(retrievedData).toEqual(newData)
    })
  })

  describe('Session Management', () => {
    test('should create and revoke sessions', async () => {
      const user = await authService.createUser({
        email: 'session@example.com',
        username: 'sessionuser'
      })

      const token = 'test-token-123'
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Create session
      const session = await authService.createSession(user.id, token, expiresAt)
      expect(session.token).toBe(token)
      expect(session.userId).toBe(user.id)

      // Revoke session
      await authService.revokeSession(token)

      // Verify session is gone
      const deletedSession = await prisma.session.findUnique({
        where: { token }
      })
      expect(deletedSession).toBeNull()
    })

    test('should clean expired sessions', async () => {
      const user = await authService.createUser({
        email: 'expired@example.com',
        username: 'expireduser'
      })

      // Create expired session
      const expiredToken = 'expired-token'
      const expiredDate = new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      await authService.createSession(user.id, expiredToken, expiredDate)

      // Create valid session
      const validToken = 'valid-token'
      const validDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      await authService.createSession(user.id, validToken, validDate)

      // Clean expired sessions
      await authService.cleanExpiredSessions()

      // Check that only valid session remains
      const expiredSession = await prisma.session.findUnique({
        where: { token: expiredToken }
      })
      const validSession = await prisma.session.findUnique({
        where: { token: validToken }
      })

      expect(expiredSession).toBeNull()
      expect(validSession).toBeTruthy()
    })
  })
})

describe('EncryptionService', () => {
  test('should encrypt and decrypt data correctly', () => {
    const encryptionService = getEncryptionService()
    const originalData = 'sensitive loan information'

    const encrypted = encryptionService.encrypt(originalData)
    expect(encrypted).not.toBe(originalData)
    expect(encrypted.length).toBeGreaterThan(0)

    const decrypted = encryptionService.decrypt(encrypted)
    expect(decrypted).toBe(originalData)
  })

  test('should generate unique encryptions for same data', () => {
    const encryptionService = getEncryptionService()
    const data = 'test data'

    const encrypted1 = encryptionService.encrypt(data)
    const encrypted2 = encryptionService.encrypt(data)

    // Should be different due to random IV
    expect(encrypted1).not.toBe(encrypted2)

    // But both should decrypt to same value
    expect(encryptionService.decrypt(encrypted1)).toBe(data)
    expect(encryptionService.decrypt(encrypted2)).toBe(data)
  })

  test('should hash and verify passwords', () => {
    const encryptionService = getEncryptionService()
    const password = 'my-secure-password'

    const hashed = encryptionService.hash(password)
    expect(hashed).not.toBe(password)
    expect(hashed).toContain(':') // Should contain salt separator

    const isValid = encryptionService.verifyHash(password, hashed)
    expect(isValid).toBe(true)

    const isInvalid = encryptionService.verifyHash('wrong-password', hashed)
    expect(isInvalid).toBe(false)
  })

  test('should generate random tokens', () => {
    const encryptionService = getEncryptionService()
    
    const token1 = encryptionService.generateToken()
    const token2 = encryptionService.generateToken()

    expect(token1).not.toBe(token2)
    expect(token1.length).toBe(64) // 32 bytes * 2 (hex)
    expect(token2.length).toBe(64)

    // Custom length
    const shortToken = encryptionService.generateToken(8)
    expect(shortToken.length).toBe(16) // 8 bytes * 2 (hex)
  })
})
