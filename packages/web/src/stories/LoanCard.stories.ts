import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoanCard } from '../components/LoanCard'
import { calculateLoan } from '../utils/loanCalculations'
import type { LoanDetails } from '../types'

// Sample loan data
const sampleLoan: LoanDetails = {
  id: '1',
  lender: 'ANZ Bank',
  loanAmount: 500000,
  interestRate: 6.25,
  loanTerm: 30,
  fees: {
    establishmentFee: 600,
    applicationFee: 0,
    valuationFee: 200,
    legalFee: 0,
    lmi: 15000,
  },
  features: {
    offset: true,
    redraw: true,
    extraRepayments: true,
    fixedRate: false,
    variableRate: true,
  },
}

const sampleLoanWithCalculation = {
  ...sampleLoan,
  calculation: calculateLoan(sampleLoan),
}

const fixedRateLoan: LoanDetails = {
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
    offset: false,
    redraw: true,
    extraRepayments: false,
    fixedRate: true,
    variableRate: false,
  },
}

const fixedRateLoanWithCalculation = {
  ...fixedRateLoan,
  calculation: calculateLoan(fixedRateLoan),
}

const meta = {
  title: 'Components/LoanCard',
  component: LoanCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component to display loan details and calculations for comparison.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isSelected: {
      control: 'boolean',
      description: 'Whether the card is currently selected',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the card is clicked',
    },
  },
} satisfies Meta<typeof LoanCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    loan: sampleLoanWithCalculation,
  },
}

export const Selected: Story = {
  args: {
    loan: sampleLoanWithCalculation,
    isSelected: true,
  },
}

export const FixedRate: Story = {
  args: {
    loan: fixedRateLoanWithCalculation,
  },
}

export const Interactive: Story = {
  args: {
    loan: sampleLoanWithCalculation,
    onClick: () => console.log('Card clicked!'),
  },
}
