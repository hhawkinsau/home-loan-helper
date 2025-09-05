import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import NextAuth from 'next-auth'
import { authConfig } from '../auth.config'

// Create NextAuth handler
const { handlers, auth } = NextAuth(authConfig)

export async function authRoutes(fastify: FastifyInstance) {
  // OAuth sign in routes
  fastify.get('/auth/signin/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const url = new URL('/api/auth/signin/google', `http://${request.headers.host}`)
    const authRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers as Record<string, string>,
    })

    const response = await handlers.GET(authRequest)
    
    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      reply.header(key, value)
    }
    
    reply.code(response.status)
    const text = await response.text()
    reply.send(text)
  })

  fastify.get('/auth/signin/github', async (request: FastifyRequest, reply: FastifyReply) => {
    const url = new URL('/api/auth/signin/github', `http://${request.headers.host}`)
    const authRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers as Record<string, string>,
    })

    const response = await handlers.GET(authRequest)
    
    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      reply.header(key, value)
    }
    
    reply.code(response.status)
    const text = await response.text()
    reply.send(text)
  })

  // OAuth callback routes
  fastify.get('/auth/callback/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const url = new URL(`/api/auth/callback/google${request.url.split('?')[1] ? '?' + request.url.split('?')[1] : ''}`, `http://${request.headers.host}`)
    const authRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers as Record<string, string>,
    })

    const response = await handlers.GET(authRequest)
    
    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      reply.header(key, value)
    }
    
    reply.code(response.status)
    const text = await response.text()
    reply.send(text)
  })

  fastify.get('/auth/callback/github', async (request: FastifyRequest, reply: FastifyReply) => {
    const url = new URL(`/api/auth/callback/github${request.url.split('?')[1] ? '?' + request.url.split('?')[1] : ''}`, `http://${request.headers.host}`)
    const authRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers as Record<string, string>,
    })

    const response = await handlers.GET(authRequest)
    
    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      reply.header(key, value)
    }
    
    reply.code(response.status)
    const text = await response.text()
    reply.send(text)
  })

  // Get current session endpoint
  fastify.get('/auth/session', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const session = await auth()
      reply.send(session || null)
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: 'Failed to get session' })
    }
  })

  // Sign out endpoint
  fastify.post('/auth/signout', async (request: FastifyRequest, reply: FastifyReply) => {
    const url = new URL('/api/auth/signout', `http://${request.headers.host}`)
    const authRequest = new Request(url.toString(), {
      method: 'POST',
      headers: request.headers as Record<string, string>,
    })

    const response = await handlers.POST(authRequest)
    
    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      reply.header(key, value)
    }
    
    reply.code(response.status)
    const text = await response.text()
    reply.send(text)
  })
}

// Export auth function for middleware
export { auth }
