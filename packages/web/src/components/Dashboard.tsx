import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={8}>
        {/* Header */}
        <HStack justify="space-between" align="center" w="full">
          <HStack gap={4}>
            <Box
              w={12}
              h={12}
              borderRadius="full"
              bg="blue.500"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
              fontWeight="bold"
            >
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </Box>
            <Box>
              <Heading size="md">Welcome back!</Heading>
              <Text color="gray.600">{user?.email}</Text>
            </Box>
          </HStack>
          <Button colorPalette="red" variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </HStack>

        <Box w="full" h="1px" bg="gray.200" />

        {/* Main Content */}
        <VStack gap={6} w="full">
          <Box w="full">
            <Heading size="lg" mb={4}>
              Your Personal Loan Analysis
            </Heading>
            <Text color="gray.600">
              Visualize your loan and explore how different scenarios affect your payments.
            </Text>
          </Box>

          {/* Current Loan Overview */}
          <Box w="full" p={6} borderWidth={1} borderRadius="lg" bg="blue.50" borderColor="blue.200">
            <VStack gap={4} w="full">
              <Heading size="md" color="blue.800">Current Loan Overview</Heading>
              
              <HStack gap={8} justify="center" w="full" wrap="wrap">
                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">$450,000</Text>
                  <Text fontSize="sm" color="gray.600">Principal Amount</Text>
                </VStack>
                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">4.2%</Text>
                  <Text fontSize="sm" color="gray.600">Interest Rate</Text>
                </VStack>
                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">$2,184</Text>
                  <Text fontSize="sm" color="gray.600">Monthly Payment</Text>
                </VStack>
                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">28 years</Text>
                  <Text fontSize="sm" color="gray.600">Remaining</Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* What-If Scenarios */}
          <HStack gap={6} align="start" w="full" wrap={{ base: 'wrap', lg: 'nowrap' }}>
            <Box flex={1} p={6} borderWidth={1} borderRadius="lg" minW="300px">
              <VStack gap={4} w="full" align="start">
                <Heading size="md">What-If Calculator</Heading>
                <Text color="gray.600" fontSize="sm">
                  See how changes affect your loan
                </Text>
                
                <VStack gap={3} w="full">
                  <Button colorPalette="blue" w="full">
                    Extra Payment Impact
                  </Button>
                  <Button colorPalette="green" w="full">
                    Interest Rate Change
                  </Button>
                  <Button colorPalette="purple" w="full">
                    Loan Term Adjustment
                  </Button>
                  <Button colorPalette="orange" w="full">
                    Refinancing Options
                  </Button>
                </VStack>
              </VStack>
            </Box>

            <Box flex={1} p={6} borderWidth={1} borderRadius="lg" minW="300px">
              <VStack gap={4} w="full" align="start">
                <Heading size="md">Scenario Results</Heading>
                <Text color="gray.600" fontSize="sm">
                  Select a scenario to see the impact
                </Text>
                
                <VStack gap={3} w="full">
                  <Box w="full" p={4} bg="green.50" borderRadius="md" borderWidth={1} borderColor="green.200">
                    <Text fontWeight="medium" color="green.800" fontSize="sm">
                      +$200/month extra payment
                    </Text>
                    <Text fontSize="xs" color="green.600">
                      Save $89,234 • Pay off 7 years early
                    </Text>
                  </Box>
                  
                  <Box w="full" p={4} bg="blue.50" borderRadius="md" borderWidth={1} borderColor="blue.200">
                    <Text fontWeight="medium" color="blue.800" fontSize="sm">
                      Refinance to 3.8%
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      Save $187/month • $67,320 total
                    </Text>
                  </Box>
                  
                  <Box w="full" p={4} bg="purple.50" borderRadius="md" borderWidth={1} borderColor="purple.200">
                    <Text fontWeight="medium" color="purple.800" fontSize="sm">
                      Switch to 15-year term
                    </Text>
                    <Text fontSize="xs" color="purple.600">
                      Higher payment but $198,450 savings
                    </Text>
                  </Box>
                </VStack>
              </VStack>
            </Box>
          </HStack>

          {/* Payment Breakdown */}
          <Box w="full" p={6} borderWidth={1} borderRadius="lg" shadow="sm">
            <VStack gap={4} w="full">
              <Heading size="md">Next 12 Months Breakdown</Heading>
              
              <HStack gap={8} justify="center" w="full" wrap="wrap">
                <VStack gap={1}>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">$13,108</Text>
                  <Text fontSize="sm" color="gray.600">Principal</Text>
                </VStack>
                <VStack gap={1}>
                  <Text fontSize="lg" fontWeight="bold" color="red.600">$13,100</Text>
                  <Text fontSize="sm" color="gray.600">Interest</Text>
                </VStack>
                <VStack gap={1}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">$26,208</Text>
                  <Text fontSize="sm" color="gray.600">Total Payments</Text>
                </VStack>
              </HStack>
              
              <Button variant="outline" colorPalette="blue" size="sm">
                View Full Amortization Schedule
              </Button>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Container>
  )
}
