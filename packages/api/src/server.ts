import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import authRoutes from './routes/auth-simple.routes'

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

// Register security plugins
async function registerPlugins() {
  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100, // 100 requests
    timeWindow: '1 minute'
  })

  // CORS - locked to frontend origin
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })

  // Cookies (HTTP-only, secure)
  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'your-secret-key-change-in-production',
    parseOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  })

  // Swagger documentation
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Home Loan Helper API',
        description: 'Secure API for home loan calculations and passkey authentication',
        version: '1.0.0'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3001}`,
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          sessionCookie: {
            type: 'apiKey',
            in: 'cookie',
            name: 'sessionToken'
          }
        }
      }
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

// Register routes
fastify.register(authRoutes, { prefix: '/api/v1' })

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
