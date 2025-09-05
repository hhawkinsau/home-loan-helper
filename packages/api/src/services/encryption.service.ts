import crypto from 'crypto'

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keyLength = 32 // 256 bits
  private readonly ivLength = 16 // 128 bits
  private readonly tagLength = 16 // 128 bits
  
  private key: Buffer

  constructor(encryptionKey?: string) {
    if (!encryptionKey) {
      throw new Error('Encryption key is required')
    }
    
    // Decode base64 key or use as-is if it's 32 bytes
    try {
      this.key = Buffer.from(encryptionKey, 'base64')
      if (this.key.length !== this.keyLength) {
        throw new Error(`Invalid key length: expected ${this.keyLength} bytes`)
      }
    } catch {
      // If base64 decode fails, try using as raw string and hash it
      this.key = crypto.scryptSync(encryptionKey, 'salt', this.keyLength)
    }
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
    cipher.setAAD(Buffer.from('home-loan-helper', 'utf8')) // Additional authenticated data
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    // Combine IV + encrypted data + auth tag
    const combined = Buffer.concat([iv, Buffer.from(encrypted, 'hex'), tag])
    return combined.toString('base64')
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    const combined = Buffer.from(encryptedData, 'base64')
    
    const iv = combined.subarray(0, this.ivLength)
    const tag = combined.subarray(-this.tagLength)
    const encrypted = combined.subarray(this.ivLength, -this.tagLength)
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
    decipher.setAuthTag(tag)
    decipher.setAAD(Buffer.from('home-loan-helper', 'utf8'))
    
    let decrypted = decipher.update(encrypted, undefined, 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  /**
   * Hash passwords or sensitive strings (one-way)
   */
  hash(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex')
    const hash = crypto.scryptSync(data, actualSalt, 64).toString('hex')
    return `${actualSalt}:${hash}`
  }

  /**
   * Verify hashed data
   */
  verifyHash(data: string, hashedData: string): boolean {
    const [salt, hash] = hashedData.split(':')
    const hashToVerify = crypto.scryptSync(data, salt, 64).toString('hex')
    return hash === hashToVerify
  }

  /**
   * Generate a secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }
}

// Singleton instance
let encryptionService: EncryptionService | null = null

export function getEncryptionService(): EncryptionService {
  if (!encryptionService) {
    encryptionService = new EncryptionService(process.env.ENCRYPTION_KEY)
  }
  return encryptionService
}
