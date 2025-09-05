import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { SessionService, SessionData } from '../services/session.service'

export interface AuthenticatedRequest extends FastifyRequest {
  session?: SessionData
  userId?: string
}

export class SessionMiddleware {
  private sessionService: SessionService

  constructor(prisma: PrismaClient) {
    this.sessionService = new SessionService(prisma)
  }

  /**
   * Middleware to validate session from cookie
   */
  authenticate = async (request: AuthenticatedRequest, reply: FastifyReply) => {
    const sessionToken = request.cookies.sessionToken

    if (!sessionToken) {
      reply.code(401).send({ error: 'No session token provided' })
      return
    }

    const session = await this.sessionService.validateSession(sessionToken)

    if (!session) {
      reply.code(401).send({ error: 'Invalid or expired session' })
      return
    }

    // Attach session data to request
    request.session = session
    request.userId = session.userId
  }

  /**
   * Optional authentication - doesn't fail if no session
   */
  optionalAuth = async (request: AuthenticatedRequest, reply: FastifyReply) => {
    const sessionToken = request.cookies.sessionToken

    if (sessionToken) {
      const session = await this.sessionService.validateSession(sessionToken)
      if (session) {
        request.session = session
        request.userId = session.userId
      }
    }
    // Don't fail if no session - just continue
  }

  /**
   * Helper to set secure session cookie
   */
  setSessionCookie(reply: FastifyReply, sessionToken: string) {
    reply.setCookie('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })
  }

  /**
   * Helper to clear session cookie
   */
  clearSessionCookie(reply: FastifyReply) {
    reply.setCookie('sessionToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })
  }
}
