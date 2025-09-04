import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize Prisma
const prisma = new PrismaClient()

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'warn'
  }
})

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })

  // JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-this'
  })

  // Swagger documentation
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Home Loan Helper API',
        description: 'Secure API for home loan calculations and user management',
        version: '1.0.0'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3001}`,
          description: 'Development server'
        }
      ]
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  })
}

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Auth routes (to be implemented)
fastify.register(async function (fastify) {
  fastify.get('/auth/status', async (request, reply) => {
    return { message: 'Auth routes ready for implementation' }
  })
}, { prefix: '/api/v1' })

// Start server
const start = async () => {
  try {
    await registerPlugins()
    
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
    
    await fastify.listen({ port, host })
    
    console.log(`🚀 Server running at http://${host}:${port}`)
    console.log(`📚 API docs at http://${host}:${port}/docs`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  await fastify.close()
  process.exit(0)
})

start()
