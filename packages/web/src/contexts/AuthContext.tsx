import React, { createContext, useState, useEffect } from 'react'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser'

interface User {
  id: string
  email?: string
  passkeys?: number // Number of registered passkeys
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  register: (email?: string) => Promise<void>
  login: () => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  supportsWebAuthn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export { AuthContext }

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

  // Check if WebAuthn is supported
  const supportsWebAuthn = typeof window !== 'undefined' && 
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.authenticated && userData.user) {
          setUser(userData.user)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email?: string) => {
    if (!supportsWebAuthn) {
      throw new Error('WebAuthn is not supported on this device')
    }

    setIsLoading(true)
    try {
      // Start registration process
      const beginResponse = await fetch(`${API_BASE}/auth/register/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      })

      if (!beginResponse.ok) {
        throw new Error('Failed to start registration')
      }

      const options = await beginResponse.json()

      // Start WebAuthn registration ceremony
      const credential = await startRegistration(options)

      // Complete registration
      const completeResponse = await fetch(`${API_BASE}/auth/register/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
          email,
        }),
        credentials: 'include',
      })

      if (!completeResponse.ok) {
        throw new Error('Registration failed')
      }

      const result = await completeResponse.json()
      setUser(result.user)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    if (!supportsWebAuthn) {
      throw new Error('WebAuthn is not supported on this device')
    }

    setIsLoading(true)
    try {
      // Start authentication process
      const beginResponse = await fetch(`${API_BASE}/auth/login/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!beginResponse.ok) {
        throw new Error('Failed to start authentication')
      }

      const options = await beginResponse.json()

      // Start WebAuthn authentication ceremony
      const credential = await startAuthentication(options)

      // Complete authentication
      const completeResponse = await fetch(`${API_BASE}/auth/login/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
        credentials: 'include',
      })

      if (!completeResponse.ok) {
        throw new Error('Authentication failed')
      }

      const result = await completeResponse.json()
      setUser(result.user)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  const isAuthenticated = !!user

  const value: AuthContextType = {
    user,
    isLoading,
    register,
    login,
    logout,
    isAuthenticated,
    supportsWebAuthn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
