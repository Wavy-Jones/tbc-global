// ============ AUTH TYPES ============
export interface User {
  id: number
  email: string
  full_name: string
  phone_number: string
  role: 'admin' | 'manager' | 'processor' | 'customer'
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

// ============ CUSTOMER TYPES ============
export interface CustomerProfile {
  id: number
  user_id: number
  id_number: string
  date_of_birth: string
  gender: string
  monthly_income: number
  employer_name: string
  job_title: string
  bank_name: string
  city: string
  province: string
  credit_score: number | null
  kyc_verified: boolean
  fica_compliant: boolean
  created_at: string
}

// ============ APPLICATION TYPES ============
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'cancelled'

export interface LoanApplication {
  id: number
  application_number: string
  customer_id: number
  requested_amount: number
  loan_term_months: number
  purpose: string | null
  status: ApplicationStatus
  affordability_score: number | null
  monthly_payment: number | null
  total_repayment: number | null
  interest_rate: number | null
  approved_amount: number | null
  rejection_reason: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string | null
}

export interface AffordabilityResult {
  can_afford: boolean
  monthly_payment: number
  total_repayment: number
  interest_rate: number
  affordability_score: number
  monthly_income: number
  disposable_income: number
  debt_to_income_ratio: number
}

// ============ LOAN TYPES ============
export type LoanStatus =
  | 'pending_disbursement'
  | 'active'
  | 'paid_off'
  | 'defaulted'
  | 'written_off'

export interface Loan {
  id: number
  loan_number: string
  customer_id: number
  principal_amount: number
  interest_rate: number
  term_months: number
  monthly_payment: number
  total_repayment: number
  status: LoanStatus
  outstanding_balance: number
  principal_paid: number
  interest_paid: number
  disbursement_date: string | null
  next_payment_date: string | null
  created_at: string
}

// ============ ADMIN EXTENDED TYPES ============
export interface CustomerWithUser {
  id: number
  user_id: number
  id_number: string
  date_of_birth: string
  gender: string
  monthly_income: number
  employer_name: string
  employer_phone: string | null
  job_title: string
  bank_name: string
  account_type: string | null
  street_address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  credit_score: number | null
  kyc_verified: boolean
  fica_compliant: boolean
  created_at: string
  user: {
    id: number
    email: string
    full_name: string
    phone_number: string | null
  }
}

export interface Payment {
  id: number
  payment_reference: string
  loan_id: number
  amount: number
  payment_date: string
  payment_method: string | null
  status: string
  principal_amount: number
  interest_amount: number
  created_at: string
}

// ============ DASHBOARD TYPES ============
export interface DashboardStats {
  total_applications: number
  pending_applications: number
  approved_applications: number
  rejected_applications: number
  active_loans: number
  total_disbursed: number
  total_outstanding: number
  default_rate: number
}
