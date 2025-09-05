import type { LoanDetails, LoanCalculation } from '../types'

/**
 * Calculate monthly repayment using standard loan formula
 * M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 */
export function calculateMonthlyRepayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (annualRate === 0) return principal / (years * 12)
  
  const monthlyRate = annualRate / 100 / 12
  const numPayments = years * 12
  
  const monthlyPayment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  
  return Math.round(monthlyPayment * 100) / 100
}

/**
 * Calculate total fees for a loan
 */
export function calculateTotalFees(fees: LoanDetails['fees']): number {
  return Object.values(fees).reduce((total, fee) => total + (fee || 0), 0)
}

/**
 * Calculate loan totals and return complete calculation
 */
export function calculateLoan(loan: LoanDetails): LoanCalculation {
  const monthlyRepayment = calculateMonthlyRepayment(
    loan.loanAmount,
    loan.interestRate,
    loan.loanTerm
  )
  
  const totalRepayments = monthlyRepayment * loan.loanTerm * 12
  const totalInterest = totalRepayments - loan.loanAmount
  const totalFees = calculateTotalFees(loan.fees)
  const totalCost = totalRepayments + totalFees
  
  return {
    monthlyRepayment,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
  }
}
