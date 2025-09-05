export interface LoanDetails {
  id: string
  lender: string
  loanAmount: number
  interestRate: number
  loanTerm: number // years
  fees: {
    establishmentFee?: number
    applicationFee?: number
    valuationFee?: number
    legalFee?: number
    lmi?: number // Lenders Mortgage Insurance
  }
  features: {
    offset?: boolean
    redraw?: boolean
    extraRepayments?: boolean
    fixedRate?: boolean
    variableRate?: boolean
  }
}

export interface LoanCalculation {
  monthlyRepayment: number
  totalInterest: number
  totalCost: number
  totalFees: number
}

export interface LoanComparison extends LoanDetails {
  calculation: LoanCalculation
}
