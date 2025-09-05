import { FastifyRequest, FastifyReply } from 'fastify'
import { auth } from '../routes/auth.routes.new'

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: {
      id: string
      email: string
      name?: string
      image?: string
    }
  }
}

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      reply.code(401).send({ error: 'Unauthorized' })
      return
    }

    // Add user to request object
    request.authUser = {
      id: session.user.id as string,
      email: session.user.email as string,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
    }
  } catch (error) {
    request.log.error(error)
    reply.code(500).send({ error: 'Authentication failed' })
  }
}

// Optional authentication (doesn't fail if no auth)
export async function optionalAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const session = await auth()
    
    if (session && session.user) {
      request.authUser = {
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
      }
    }
  } catch (error) {
    // Log error but don't fail request
    request.log.warn({ error }, 'Optional auth failed')
  }
}
