import React from 'react'
import {
  Box,
  Card,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Separator,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import type { LoanComparison } from '../types'

interface LoanCardProps {
  loan: LoanComparison
  isSelected?: boolean
  onClick?: () => void
}

export const LoanCard: React.FC<LoanCardProps> = ({ 
  loan, 
  isSelected = false, 
  onClick 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatRate = (rate: number) => `${rate.toFixed(2)}%`

  return (
    <Card.Root
      variant={isSelected ? 'elevated' : 'outline'}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      _hover={onClick ? { shadow: 'md' } : undefined}
      borderWidth={isSelected ? 2 : 1}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
    >
      <Card.Body>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <HStack justify="space-between" align="start">
            <Heading size="md">{loan.lender}</Heading>
            <Badge 
              colorPalette={loan.features.fixedRate ? 'blue' : 'green'}
              variant="subtle"
            >
              {loan.features.fixedRate ? 'Fixed' : 'Variable'}
            </Badge>
          </HStack>

          {/* Key metrics */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Text fontSize="sm" color="gray.600">Interest Rate</Text>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                {formatRate(loan.interestRate)}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize="sm" color="gray.600">Monthly Repayment</Text>
              <Text fontSize="xl" fontWeight="bold">
                {formatCurrency(loan.calculation.monthlyRepayment)}
              </Text>
            </GridItem>
          </Grid>

          <Separator />

          {/* Loan details */}
          <Grid templateColumns="repeat(2, 1fr)" gap={3} fontSize="sm">
            <GridItem>
              <Text color="gray.600">Loan Amount</Text>
              <Text fontWeight="semibold">{formatCurrency(loan.loanAmount)}</Text>
            </GridItem>
            <GridItem>
              <Text color="gray.600">Loan Term</Text>
              <Text fontWeight="semibold">{loan.loanTerm} years</Text>
            </GridItem>
            <GridItem>
              <Text color="gray.600">Total Interest</Text>
              <Text fontWeight="semibold">{formatCurrency(loan.calculation.totalInterest)}</Text>
            </GridItem>
            <GridItem>
              <Text color="gray.600">Total Fees</Text>
              <Text fontWeight="semibold">{formatCurrency(loan.calculation.totalFees)}</Text>
            </GridItem>
          </Grid>

          {/* Features */}
          {(loan.features.offset || loan.features.redraw || loan.features.extraRepayments) && (
            <>
              <Separator />
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Features</Text>
                <HStack gap={2} flexWrap="wrap">
                  {loan.features.offset && (
                    <Badge size="sm" colorPalette="green">Offset Account</Badge>
                  )}
                  {loan.features.redraw && (
                    <Badge size="sm" colorPalette="blue">Redraw</Badge>
                  )}
                  {loan.features.extraRepayments && (
                    <Badge size="sm" colorPalette="purple">Extra Repayments</Badge>
                  )}
                </HStack>
              </Box>
            </>
          )}

          {/* Total cost highlight */}
          <Box bg="gray.50" p={3} borderRadius="md">
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Total Cost Over {loan.loanTerm} Years
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">
                {formatCurrency(loan.calculation.totalCost)}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
