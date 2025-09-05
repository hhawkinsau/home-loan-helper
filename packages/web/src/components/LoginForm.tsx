import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Field,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  Link,
  Icon,
  Card,
} from '@chakra-ui/react'
import { FaFingerprint } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import { useAuth } from '../hooks/useAuth'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { register, login, isLoading, supportsWebAuthn } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!supportsWebAuthn) {
      setError('Your device does not support passkeys. Please use a device with biometric authentication.')
      return
    }

    if (!email) {
      setError('Email is required for registration')
      return
    }

    try {
      await register(email)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(message)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!supportsWebAuthn) {
      setError('Your device does not support passkeys. Please use a device with biometric authentication.')
      return
    }

    try {
      await login()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.'
      setError(message)
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Container maxW="md" py={8}>
        <VStack gap={8}>
          {/* Header Section */}
          <Box textAlign="center">
            <VStack gap={4}>
              <VStack gap={2}>
                <Heading size="xl" color="gray.800">
                  Welcome to Home Loan Helper
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Secure passwordless authentication with passkeys
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Main Login Card */}
          <Card.Root w="full" variant="elevated" size="lg">
            <Card.Body p={8}>
              <VStack gap={6}>
                {/* WebAuthn Support Check */}
                {!supportsWebAuthn && (
                  <Alert.Root status="warning" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Description>
                      Your device doesn't support passkeys. Please use a device with biometric authentication.
                    </Alert.Description>
                  </Alert.Root>
                )}

                {/* Passkey Authentication Section */}
                <VStack gap={4} textAlign="center">
                  <Icon boxSize={12} color="blue.500">
                    <FaFingerprint />
                  </Icon>
                  <VStack gap={2}>
                    <Heading size="lg" color="gray.800">
                      Passkey Authentication
                    </Heading>
                    <Text color="gray.600" fontSize="sm" maxW="sm">
                      Use your device's built-in security (fingerprint, face recognition, or PIN) 
                      for secure, passwordless access to your personal loan calculations.
                    </Text>
                  </VStack>
                </VStack>

                {/* Registration Section */}
                <Box w="full">
                  <VStack gap={4}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      New user? Register with your email to create a passkey
                    </Text>
                    
                    <form onSubmit={handleRegister}>
                      <VStack gap={4} w="full">
                        <Field.Root required>
                          <Field.Label fontSize="sm" fontWeight="medium">
                            <Icon mr={2}>
                              <HiMail />
                            </Icon>
                            Email address
                          </Field.Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            size="lg"
                            bg="gray.50"
                            border="2px solid"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'gray.300' }}
                            _focus={{ borderColor: 'blue.500', bg: 'white' }}
                            transition="all 0.2s"
                          />
                        </Field.Root>

                        <Button
                          type="submit"
                          colorPalette="blue"
                          w="full"
                          size="lg"
                          loading={isLoading}
                          loadingText="Creating passkey..."
                          disabled={!supportsWebAuthn}
                          transition="all 0.2s"
                          bgGradient="linear(to-r, blue.500, blue.600)"
                          _hover={{ 
                            bgGradient: 'linear(to-r, blue.600, blue.700)',
                            transform: 'translateY(-1px)', 
                            shadow: 'lg' 
                          }}
                        >
                          <Icon mr={2}>
                            <FaFingerprint />
                          </Icon>
                          Create Passkey & Sign In
                        </Button>
                      </VStack>
                    </form>
                  </VStack>
                </Box>

                {/* Existing User Section */}
                <Box w="full" pt={4} borderTop="1px solid" borderColor="gray.200">
                  <VStack gap={4}>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      Already have a passkey?
                    </Text>
                    
                    <Button
                      onClick={handleLogin}
                      variant="outline"
                      w="full"
                      size="lg"
                      loading={isLoading}
                      loadingText="Authenticating..."
                      disabled={!supportsWebAuthn}
                      transition="all 0.2s"
                      _hover={{ 
                        bg: 'gray.50',
                        transform: 'translateY(-1px)', 
                        shadow: 'md' 
                      }}
                    >
                      <Icon mr={2}>
                        <FaFingerprint />
                      </Icon>
                      Sign In with Passkey
                    </Button>
                  </VStack>
                </Box>

                {/* Error Display */}
                {error && (
                  <Alert.Root status="error" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Root>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Footer */}
          <VStack gap={2} textAlign="center">
            <Text fontSize="xs" color="gray.500">
              Passkeys are stored securely on your device and never leave it.{' '}
              <Link color="blue.500" href="/security" fontWeight="medium">
                Learn more about security
              </Link>
            </Text>
            <Text fontSize="xs" color="gray.500">
              By signing in, you agree to our{' '}
              <Link color="blue.500" href="/terms" fontWeight="medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link color="blue.500" href="/privacy" fontWeight="medium">
                Privacy Policy
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}
