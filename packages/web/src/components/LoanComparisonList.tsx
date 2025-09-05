import React, { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Text,
} from '@chakra-ui/react'
import { LoanCard } from './LoanCard'
import { calculateLoan } from '../utils/loanCalculations'
import type { LoanDetails, LoanComparison } from '../types'

// Sample loan data for demonstration
const sampleLoans: LoanDetails[] = [
  {
    id: '1',
    lender: 'ANZ Bank',
    loanAmount: 500000,
    interestRate: 6.25,
    loanTerm: 30,
    fees: {
      establishmentFee: 600,
      applicationFee: 0,
      valuationFee: 200,
      lmi: 15000,
    },
    features: {
      offset: true,
      redraw: true,
      extraRepayments: true,
      variableRate: true,
    },
  },
  {
    id: '2',
    lender: 'Commonwealth Bank',
    loanAmount: 500000,
    interestRate: 5.89,
    loanTerm: 30,
    fees: {
      establishmentFee: 800,
      applicationFee: 250,
      valuationFee: 150,
      legalFee: 300,
      lmi: 15000,
    },
    features: {
      redraw: true,
      fixedRate: true,
    },
  },
  {
    id: '3',
    lender: 'Westpac',
    loanAmount: 500000,
    interestRate: 6.15,
    loanTerm: 30,
    fees: {
      establishmentFee: 700,
      applicationFee: 0,
      valuationFee: 180,
      lmi: 15000,
    },
    features: {
      offset: true,
      redraw: true,
      extraRepayments: true,
      variableRate: true,
    },
  },
  {
    id: '4',
    lender: 'NAB',
    loanAmount: 500000,
    interestRate: 6.05,
    loanTerm: 30,
    fees: {
      establishmentFee: 500,
      applicationFee: 200,
      valuationFee: 200,
      lmi: 15000,
    },
    features: {
      offset: true,
      redraw: true,
      extraRepayments: true,
      variableRate: true,
    },
  },
]

export const LoanComparisonList: React.FC = () => {
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  
  // Calculate loan details for all loans
  const loansWithCalculations: LoanComparison[] = sampleLoans.map(loan => ({
    ...loan,
    calculation: calculateLoan(loan),
  }))

  // Sort by total cost (default sorting)
  const sortedLoans = [...loansWithCalculations].sort(
    (a, b) => a.calculation.totalCost - b.calculation.totalCost
  )

  const bestLoan = sortedLoans[0]
  const potentialSavings = sortedLoans[sortedLoans.length - 1].calculation.totalCost - bestLoan.calculation.totalCost

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack align="stretch" gap={8}>
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={4}>
            Home Loan Comparison
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Compare home loans to find the best deal for your situation
          </Text>
        </Box>

        {/* Summary */}
        <Box bg="blue.50" p={6} borderRadius="lg" borderLeft="4px" borderLeftColor="blue.500">
          <VStack align="start" gap={2}>
            <Heading size="md" color="blue.800">Best Deal Summary</Heading>
            <HStack gap={8} flexWrap="wrap">
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="blue.600">Best Lender</Text>
                <Text fontWeight="bold" fontSize="lg">{bestLoan.lender}</Text>
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="blue.600">Monthly Repayment</Text>
                <Text fontWeight="bold" fontSize="lg">{formatCurrency(bestLoan.calculation.monthlyRepayment)}</Text>
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="blue.600">Total Cost</Text>
                <Text fontWeight="bold" fontSize="lg">{formatCurrency(bestLoan.calculation.totalCost)}</Text>
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="blue.600">Potential Savings</Text>
                <Text fontWeight="bold" fontSize="lg" color="green.600">{formatCurrency(potentialSavings)}</Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Filters/Actions */}
        <HStack justify="space-between" align="center" flexWrap="wrap">
          <Text fontSize="lg" fontWeight="semibold">
            Comparing {loansWithCalculations.length} loans
          </Text>
          <HStack gap={2}>
            <Button variant="outline" size="sm">
              Sort by Rate
            </Button>
            <Button variant="outline" size="sm">
              Sort by Repayment
            </Button>
            <Button variant="solid" size="sm">
              Sort by Total Cost
            </Button>
          </HStack>
        </HStack>

        {/* Loan Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {sortedLoans.map((loan, index) => (
            <Box key={loan.id} position="relative">
              {index === 0 && (
                <Box
                  position="absolute"
                  top="-2"
                  left="-2"
                  zIndex={1}
                  bg="green.500"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Best Deal
                </Box>
              )}
              <LoanCard
                loan={loan}
                isSelected={selectedLoanId === loan.id}
                onClick={() => setSelectedLoanId(loan.id === selectedLoanId ? null : loan.id)}
              />
            </Box>
          ))}
        </SimpleGrid>

        {/* Call to action */}
        <Box textAlign="center" py={8}>
          <VStack gap={4}>
            <Heading size="md">Ready to get started?</Heading>
            <Text color="gray.600">
              Contact {bestLoan.lender} to learn more about their {formatCurrency(bestLoan.calculation.monthlyRepayment)}/month loan
            </Text>
            <Button size="lg" colorScheme="blue">
              Get Pre-Approval
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
