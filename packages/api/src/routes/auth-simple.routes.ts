import { FastifyInstance } from 'fastify'

export default async function authRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/healthz', async (request, reply) => {
    return { status: 'ok', message: 'Passkey-only API is running', timestamp: new Date().toISOString() }
  })

  // Placeholder auth endpoints
  fastify.get('/auth/me', async (request, reply) => {
    return { authenticated: false, message: 'Session authentication coming soon' }
  })

  fastify.post('/auth/register/begin', async (request, reply) => {
    return { message: 'WebAuthn registration endpoint - coming soon' }
  })

  fastify.post('/auth/login/begin', async (request, reply) => {
    return { message: 'WebAuthn login endpoint - coming soon' }
  })
}
