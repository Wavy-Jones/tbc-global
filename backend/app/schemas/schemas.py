"""
Pydantic Schemas for API Request/Response Validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ==================== ENUMS ====================
class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    PROCESSOR = "processor"
    CUSTOMER = "customer"


class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class LoanStatus(str, Enum):
    PENDING_DISBURSEMENT = "pending_disbursement"
    ACTIVE = "active"
    PAID_OFF = "paid_off"
    DEFAULTED = "defaulted"
    WRITTEN_OFF = "written_off"


# ==================== AUTH SCHEMAS ====================
class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    full_name: str = Field(..., min_length=2)
    phone_number: str = Field(..., min_length=10)
    
    @validator('password')
    def password_strength(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data"""
    user_id: int
    email: str
    role: UserRole


class UserResponse(BaseModel):
    """User information response"""
    id: int
    email: EmailStr
    full_name: str
    phone_number: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== CUSTOMER SCHEMAS ====================
class CustomerCreate(BaseModel):
    """Customer profile creation"""
    id_number: str = Field(..., min_length=13, max_length=13)
    date_of_birth: datetime
    gender: str
    nationality: str = "South African"
    
    # Address
    street_address: str
    city: str
    province: str
    postal_code: str
    
    # Employment
    employer_name: str
    employer_phone: str
    job_title: str
    employment_start_date: datetime
    monthly_income: float = Field(..., ge=4000, description="Minimum R4000")
    
    # Banking
    bank_name: str
    account_number: str
    account_type: str
    branch_code: str


class CustomerUpdate(BaseModel):
    """Customer profile update"""
    phone_number: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    employer_name: Optional[str] = None
    employer_phone: Optional[str] = None
    job_title: Optional[str] = None
    monthly_income: Optional[float] = None
    bank_name: Optional[str] = None
    account_number: Optional[str] = None


class CustomerResponse(BaseModel):
    """Customer profile response"""
    id: int
    user_id: int
    id_number: str
    date_of_birth: datetime
    gender: str
    monthly_income: float
    employer_name: str
    job_title: str
    bank_name: str
    credit_score: Optional[int]
    kyc_verified: bool
    fica_compliant: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== LOAN APPLICATION SCHEMAS ====================
class LoanApplicationCreate(BaseModel):
    """Create loan application"""
    requested_amount: float = Field(..., ge=100, le=5000, description="Between R100 and R5000")
    loan_term_months: int = Field(..., ge=1, le=24, description="Between 1 and 24 months")
    purpose: Optional[str] = Field(None, max_length=500)


class LoanApplicationUpdate(BaseModel):
    """Update loan application"""
    requested_amount: Optional[float] = Field(None, ge=100, le=5000)
    loan_term_months: Optional[int] = Field(None, ge=1, le=24)
    purpose: Optional[str] = None
    status: Optional[ApplicationStatus] = None


class AffordabilityResult(BaseModel):
    """Affordability calculation result"""
    can_afford: bool
    monthly_payment: float
    total_repayment: float
    interest_rate: float
    affordability_score: float
    monthly_income: float
    disposable_income: float
    debt_to_income_ratio: float


class LoanApplicationResponse(BaseModel):
    """Loan application response"""
    id: int
    application_number: str
    customer_id: int
    requested_amount: float
    loan_term_months: int
    purpose: Optional[str]
    status: ApplicationStatus
    affordability_score: Optional[float]
    monthly_payment: Optional[float]
    total_repayment: Optional[float]
    interest_rate: Optional[float]
    approved_amount: Optional[float]
    rejection_reason: Optional[str]
    submitted_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ApplicationDecision(BaseModel):
    """Admin decision on application"""
    approved: bool
    approved_amount: Optional[float] = None
    rejection_reason: Optional[str] = None


# ==================== LOAN SCHEMAS ====================
class LoanResponse(BaseModel):
    """Active loan response"""
    id: int
    loan_number: str
    customer_id: int
    principal_amount: float
    interest_rate: float
    term_months: int
    monthly_payment: float
    total_repayment: float
    status: LoanStatus
    outstanding_balance: float
    principal_paid: float
    interest_paid: float
    disbursement_date: Optional[datetime]
    next_payment_date: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== DASHBOARD SCHEMAS ====================
class DashboardStats(BaseModel):
    """Admin dashboard statistics"""
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    active_loans: int
    total_disbursed: float
    total_outstanding: float
    default_rate: float


class ApplicationListItem(BaseModel):
    """Application list item for admin"""
    id: int
    application_number: str
    customer_name: str
    customer_email: str
    requested_amount: float
    status: ApplicationStatus
    submitted_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== COMMON SCHEMAS ====================
class Message(BaseModel):
    """Generic message response"""
    message: str


class ErrorResponse(BaseModel):
    """Error response"""
    detail: str


# ==================== ADMIN EXTENDED SCHEMAS ====================

class UserBasicInfo(BaseModel):
    id: int
    email: str
    full_name: str
    phone_number: Optional[str] = None

    class Config:
        from_attributes = True


class CustomerWithUserResponse(BaseModel):
    id: int
    user_id: int
    id_number: str
    date_of_birth: datetime
    gender: str
    monthly_income: float
    employer_name: str
    employer_phone: Optional[str] = None
    job_title: str
    bank_name: str
    account_type: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    credit_score: Optional[int] = None
    kyc_verified: bool
    fica_compliant: bool
    created_at: datetime
    user: UserBasicInfo

    class Config:
        from_attributes = True


class PaymentCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Payment amount in ZAR")
    payment_method: str = Field(default="eft")
    notes: Optional[str] = None


class PaymentResponse(BaseModel):
    id: int
    payment_reference: str
    loan_id: int
    amount: float
    payment_date: datetime
    payment_method: Optional[str] = None
    status: str
    principal_amount: float
    interest_amount: float
    created_at: datetime

    class Config:
        from_attributes = True
