import { FastifyRequest } from 'fastify'

// JWT Payload
export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Authenticated request
export interface AuthenticatedRequest extends FastifyRequest {
  user: JWTPayload
}

// WebAuthn types
export interface PasskeyRegistrationRequest {
  email: string
  username?: string
  challenge?: string
}

export interface PasskeyRegistrationResponse {
  credentialId: string
  publicKey: string
  attestationObject: string
  clientDataJSON: string
}

export interface PasskeyAuthenticationRequest {
  email: string
  challenge?: string
}

export interface PasskeyAuthenticationResponse {
  credentialId: string
  authenticatorData: string
  signature: string
  clientDataJSON: string
}

// OAuth types
export interface OAuthCallbackRequest {
  code: string
  state?: string
}

// User data types
export interface UserProfile {
  id: string
  email: string
  username?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  email: string
  username?: string
  encryptedData?: string
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  token: string
  user: UserProfile
  expiresAt: Date
}

// Environment variables
export interface EnvironmentConfig {
  DATABASE_URL: string
  JWT_SECRET: string
  ENCRYPTION_KEY: string
  PORT: number
  NODE_ENV: string
  FRONTEND_URL: string
  WEBAUTHN_RP_NAME: string
  WEBAUTHN_RP_ID: string
  WEBAUTHN_ORIGIN: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
}
