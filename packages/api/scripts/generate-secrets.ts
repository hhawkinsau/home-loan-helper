#!/usr/bin/env node
import crypto from 'crypto'

/**
 * Generate secure secrets for the application
 */
function generateSecrets() {
  console.log('🔐 Generating secure secrets for Home Loan Helper API')
  console.log('=' .repeat(60))
  
  // Generate JWT secret (256-bit)
  const jwtSecret = crypto.randomBytes(32).toString('hex')
  console.log(`JWT_SECRET="${jwtSecret}"`)
  
  // Generate encryption key (256-bit base64)
  const encryptionKey = crypto.randomBytes(32).toString('base64')
  console.log(`ENCRYPTION_KEY="${encryptionKey}"`)
  
  // Generate database password
  const dbPassword = crypto.randomBytes(16).toString('hex')
  console.log(`DB_PASSWORD="${dbPassword}"`)
  
  console.log('')
  console.log('💡 Usage:')
  console.log('1. Copy these values to your .env file')
  console.log('2. Update your DATABASE_URL with the DB_PASSWORD')
  console.log('3. Never commit these secrets to git!')
  console.log('')
  console.log('⚠️  Keep these secrets secure and use different ones for production!')
}

generateSecrets()
