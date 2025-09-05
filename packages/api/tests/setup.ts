import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Test database setup - use the same database as development for testing
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/home_loan_helper?schema=public'
    }
  }
})

// Clean database before each test
beforeEach(async () => {
  try {
    // Clean up test data in reverse dependency order
    await prisma.serverSession.deleteMany()
    await prisma.passkey.deleteMany()
    await prisma.user.deleteMany()
  } catch (error) {
    // If tables don't exist, that's fine - the test will create them
    console.warn('Database cleanup warning:', error instanceof Error ? error.message : 'Unknown error')
  }
})

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect()
})

export { prisma }
