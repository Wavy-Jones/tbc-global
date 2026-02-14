"""
TBC Global - Database Models
SQLAlchemy ORM models for all database tables
"""
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text,
    ForeignKey, Enum as SQLEnum, Index, CheckConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.db.database import Base


# Enums
class UserRole(str, enum.Enum):
    """User roles for authorization"""
    ADMIN = "admin"
    MANAGER = "manager"
    PROCESSOR = "processor"
    CUSTOMER = "customer"


class ApplicationStatus(str, enum.Enum):
    """Loan application status workflow"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class LoanStatus(str, enum.Enum):
    """Active loan status"""
    PENDING_DISBURSEMENT = "pending_disbursement"
    ACTIVE = "active"
    PAID_OFF = "paid_off"
    DEFAULTED = "defaulted"
    WRITTEN_OFF = "written_off"


class PaymentStatus(str, enum.Enum):
    """Payment transaction status"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class DocumentType(str, enum.Enum):
    """Document categories"""
    ID_DOCUMENT = "id_document"
    PROOF_OF_RESIDENCE = "proof_of_residence"
    PAYSLIP = "payslip"
    BANK_STATEMENT = "bank_statement"
    OTHER = "other"


class NotificationChannel(str, enum.Enum):
    """Notification delivery channels"""
    EMAIL = "email"
    SMS = "sms"
    WHATSAPP = "whatsapp"


# Models
class User(Base):
    """User accounts (customers and staff)"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    role = Column(SQLEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    customer_profile = relationship("Customer", back_populates="user", uselist=False)
    applications = relationship("LoanApplication", back_populates="applicant")
    notifications = relationship("Notification", back_populates="user")
    
    __table_args__ = (
        Index('idx_user_email_active', 'email', 'is_active'),
    )


class Customer(Base):
    """Customer profile and KYC information"""
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Personal Information
    id_number = Column(String(20), unique=True, index=True)
    date_of_birth = Column(DateTime)
    gender = Column(String(10))
    nationality = Column(String(100))
    
    # Address
    street_address = Column(String(255))
    city = Column(String(100))
    province = Column(String(100))
    postal_code = Column(String(10))
    
    # Employment
    employer_name = Column(String(255))
    employer_phone = Column(String(20))
    job_title = Column(String(100))
    employment_start_date = Column(DateTime)
    monthly_income = Column(Float)
    
    # Banking
    bank_name = Column(String(100))
    account_number = Column(String(50))
    account_type = Column(String(50))
    branch_code = Column(String(20))
    
    # Credit
    credit_score = Column(Integer)
    credit_score_date = Column(DateTime)
    
    # Compliance
    kyc_verified = Column(Boolean, default=False)
    kyc_verified_date = Column(DateTime)
    fica_compliant = Column(Boolean, default=False)
    fica_verified_date = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="customer_profile")
    applications = relationship("LoanApplication", back_populates="customer")
    loans = relationship("Loan", back_populates="customer")
    documents = relationship("Document", back_populates="customer")
    
    __table_args__ = (
        Index('idx_customer_id_number', 'id_number'),
    )


class LoanApplication(Base):
    """Loan application submissions"""
    __tablename__ = "loan_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Foreign Keys
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Loan Details
    requested_amount = Column(Float, nullable=False)
    loan_term_months = Column(Integer, nullable=False)
    purpose = Column(Text)
    
    # Status
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.DRAFT, nullable=False)
    
    # Assessment
    affordability_score = Column(Float)
    risk_score = Column(Float)
    monthly_payment = Column(Float)
    total_repayment = Column(Float)
    interest_rate = Column(Float)
    
    # Decision
    approved_amount = Column(Float)
    rejection_reason = Column(Text)
    reviewed_by = Column(Integer, ForeignKey("users.id"))
    reviewed_at = Column(DateTime(timezone=True))
    
    # Metadata
    submitted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("Customer", back_populates="applications")
    applicant = relationship("User", foreign_keys=[applicant_id], back_populates="applications")
    loan = relationship("Loan", back_populates="application", uselist=False)
    documents = relationship("Document", back_populates="application")
    
    __table_args__ = (
        CheckConstraint('requested_amount >= 500 AND requested_amount <= 5500', name='check_loan_amount'),
        CheckConstraint('loan_term_months >= 1 AND loan_term_months <= 24', name='check_loan_term'),
        Index('idx_application_status', 'status'),
        Index('idx_application_customer', 'customer_id', 'status'),
    )


class Loan(Base):
    """Active loans"""
    __tablename__ = "loans"
    
    id = Column(Integer, primary_key=True, index=True)
    loan_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Foreign Keys
    application_id = Column(Integer, ForeignKey("loan_applications.id"), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    
    # Loan Terms
    principal_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    term_months = Column(Integer, nullable=False)
    monthly_payment = Column(Float, nullable=False)
    total_repayment = Column(Float, nullable=False)
    
    # Status
    status = Column(SQLEnum(LoanStatus), default=LoanStatus.PENDING_DISBURSEMENT, nullable=False)
    
    # Disbursement
    disbursement_date = Column(DateTime(timezone=True))
    disbursement_method = Column(String(50))
    disbursement_reference = Column(String(100))
    
    # Repayment
    first_payment_date = Column(DateTime(timezone=True))
    last_payment_date = Column(DateTime(timezone=True))
    next_payment_date = Column(DateTime(timezone=True))
    
    # Balances
    outstanding_balance = Column(Float, default=0)
    principal_paid = Column(Float, default=0)
    interest_paid = Column(Float, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    closed_at = Column(DateTime(timezone=True))
    
    # Relationships
    application = relationship("LoanApplication", back_populates="loan")
    customer = relationship("Customer", back_populates="loans")
    payments = relationship("Payment", back_populates="loan")
    
    __table_args__ = (
        Index('idx_loan_status', 'status'),
        Index('idx_loan_customer', 'customer_id', 'status'),
    )


class Payment(Base):
    """Payment transactions"""
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    payment_reference = Column(String(100), unique=True, index=True, nullable=False)
    
    # Foreign Key
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False)
    
    # Payment Details
    amount = Column(Float, nullable=False)
    payment_date = Column(DateTime(timezone=True), nullable=False)
    payment_method = Column(String(50))  # eft, debit_order, cash, etc.
    
    # Status
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    
    # Allocation
    principal_amount = Column(Float, default=0)
    interest_amount = Column(Float, default=0)
    fees_amount = Column(Float, default=0)
    
    # Payment Gateway
    gateway_reference = Column(String(100))
    gateway_response = Column(Text)
    
    # Metadata
    processed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    loan = relationship("Loan", back_populates="payments")
    
    __table_args__ = (
        CheckConstraint('amount > 0', name='check_payment_amount'),
        Index('idx_payment_loan', 'loan_id', 'status'),
    )


class Document(Base):
    """Uploaded documents"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("loan_applications.id"))
    
    # Document Details
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    
    # Verification
    is_verified = Column(Boolean, default=False)
    verified_by = Column(Integer, ForeignKey("users.id"))
    verified_at = Column(DateTime(timezone=True))
    verification_notes = Column(Text)
    
    # Metadata
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    customer = relationship("Customer", back_populates="documents")
    application = relationship("LoanApplication", back_populates="documents")
    
    __table_args__ = (
        Index('idx_document_customer', 'customer_id', 'document_type'),
    )


class Notification(Base):
    """Notification history"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Notification Details
    channel = Column(SQLEnum(NotificationChannel), nullable=False)
    recipient = Column(String(255), nullable=False)  # email or phone
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    
    # Status
    sent = Column(Boolean, default=False)
    sent_at = Column(DateTime(timezone=True))
    delivery_status = Column(String(50))
    error_message = Column(Text)
    
    # External Reference
    external_id = Column(String(100))  # SendGrid/Twilio message ID
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    
    __table_args__ = (
        Index('idx_notification_user_channel', 'user_id', 'channel'),
    )
