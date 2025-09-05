import { ChakraProvider, defaultSystem, Box, Spinner } from '@chakra-ui/react'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'

// Lazy load components for better code splitting
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })))
const LoginForm = lazy(() => import('./components/LoginForm').then(m => ({ default: m.LoginForm })))

function AppContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    )
  }

  return (
    <Suspense fallback={
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    }>
      {user ? <Dashboard /> : <LoginForm />}
    </Suspense>
  )
}

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
