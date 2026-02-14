"""
Loan Application API Endpoints
Handle loan applications, affordability checks, and approvals
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime
import uuid

from app.db.database import get_db
from app.models.models import User, Customer, LoanApplication, Loan, ApplicationStatus, LoanStatus
from app.schemas.schemas import (
    LoanApplicationCreate, LoanApplicationResponse, LoanApplicationUpdate,
    AffordabilityResult, ApplicationDecision, LoanResponse, Message
)
from app.api.dependencies import get_current_user, get_current_customer, get_current_admin


router = APIRouter()


def calculate_affordability(monthly_income: float, requested_amount: float, loan_term_months: int) -> AffordabilityResult:
    """
    Calculate loan affordability
    
    Interest rate: 15% per annum
    Formula: Monthly Payment = P * r * (1 + r)^n / ((1 + r)^n - 1)
    where P = principal, r = monthly rate, n = number of months
    """
    # Interest rate (15% annual = 1.25% monthly)
    annual_rate = 0.15
    monthly_rate = annual_rate / 12
    
    # Calculate monthly payment using loan formula
    if loan_term_months == 0:
        monthly_payment = requested_amount
    else:
        monthly_payment = (requested_amount * monthly_rate * ((1 + monthly_rate) ** loan_term_months)) / \
                         (((1 + monthly_rate) ** loan_term_months) - 1)
    
    total_repayment = monthly_payment * loan_term_months
    
    # Calculate affordability
    # Rule: Monthly payment should not exceed 40% of income
    max_payment = monthly_income * 0.4
    disposable_income = monthly_income - monthly_payment
    debt_to_income_ratio = monthly_payment / monthly_income
    
    # Affordability score (0-100)
    # Higher is better
    if monthly_payment <= max_payment:
        affordability_score = min(100, (1 - debt_to_income_ratio) * 100)
    else:
        affordability_score = max(0, (max_payment / monthly_payment) * 100)
    
    can_afford = (
        monthly_payment <= max_payment and
        disposable_income >= 2000 and  # Minimum R2000 left after payment
        monthly_income >= 4000  # Minimum income requirement
    )
    
    return AffordabilityResult(
        can_afford=can_afford,
        monthly_payment=round(monthly_payment, 2),
        total_repayment=round(total_repayment, 2),
        interest_rate=annual_rate,
        affordability_score=round(affordability_score, 2),
        monthly_income=monthly_income,
        disposable_income=round(disposable_income, 2),
        debt_to_income_ratio=round(debt_to_income_ratio, 4)
    )


@router.post("/calculate-affordability", response_model=AffordabilityResult)
def check_affordability(
    application_data: LoanApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Calculate affordability before submitting application
    
    Check if customer can afford the requested loan amount.
    """
    # Get customer profile
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found. Please complete your profile first."
        )
    
    # Calculate affordability
    result = calculate_affordability(
        customer.monthly_income,
        application_data.requested_amount,
        application_data.loan_term_months
    )
    
    return result


@router.post("/", response_model=LoanApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    application_data: LoanApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Submit a new loan application
    
    Automatically calculates affordability and assigns application number.
    """
    # Get customer profile
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found. Please complete your profile first."
        )
    
    # Check KYC compliance
    if not customer.kyc_verified or not customer.fica_compliant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="KYC/FICA verification required before applying"
        )
    
    # Calculate affordability
    affordability = calculate_affordability(
        customer.monthly_income,
        application_data.requested_amount,
        application_data.loan_term_months
    )
    
    # Generate application number
    app_number = f"TBC-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    # Create application
    new_application = LoanApplication(
        application_number=app_number,
        customer_id=customer.id,
        applicant_id=current_user.id,
        requested_amount=application_data.requested_amount,
        loan_term_months=application_data.loan_term_months,
        purpose=application_data.purpose,
        status=ApplicationStatus.SUBMITTED,
        affordability_score=affordability.affordability_score,
        monthly_payment=affordability.monthly_payment,
        total_repayment=affordability.total_repayment,
        interest_rate=affordability.interest_rate,
        submitted_at=datetime.utcnow()
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return new_application


@router.get("/my-applications", response_model=List[LoanApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Get all applications for current customer
    """
    applications = db.query(LoanApplication)\
        .filter(LoanApplication.applicant_id == current_user.id)\
        .order_by(desc(LoanApplication.created_at))\
        .all()
    
    return applications


@router.get("/{application_id}", response_model=LoanApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get application by ID
    
    Customers can only view their own applications.
    Admins can view all applications.
    """
    application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    if current_user.role.value == "customer" and application.applicant_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this application"
        )
    
    return application


@router.get("/", response_model=List[LoanApplicationResponse])
def list_applications(
    status_filter: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    List all applications (Admin only)
    
    - **status**: Filter by status (submitted, under_review, approved, rejected)
    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    query = db.query(LoanApplication)
    
    if status_filter:
        try:
            status_enum = ApplicationStatus(status_filter)
            query = query.filter(LoanApplication.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    applications = query.order_by(desc(LoanApplication.submitted_at)).offset(skip).limit(limit).all()
    return applications


@router.post("/{application_id}/review", response_model=LoanApplicationResponse)
def review_application(
    application_id: int,
    decision: ApplicationDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Approve or reject an application (Admin only)
    
    - **approved**: true to approve, false to reject
    - **approved_amount**: Amount approved (can be less than requested)
    - **rejection_reason**: Reason for rejection (required if rejected)
    """
    application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check status
    if application.status not in [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot review application with status: {application.status.value}"
        )
    
    if decision.approved:
        # Approve application
        approved_amount = decision.approved_amount or application.requested_amount
        
        # Validate approved amount
        if approved_amount < 500 or approved_amount > 5500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Approved amount must be between R500 and R5500"
            )
        
        application.status = ApplicationStatus.APPROVED
        application.approved_amount = approved_amount
        application.reviewed_by = current_user.id
        application.reviewed_at = datetime.utcnow()
        
        # Create loan record
        loan_number = f"LOAN-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Recalculate with approved amount
        customer = db.query(Customer).filter(Customer.id == application.customer_id).first()
        affordability = calculate_affordability(
            customer.monthly_income,
            approved_amount,
            application.loan_term_months
        )
        
        new_loan = Loan(
            loan_number=loan_number,
            application_id=application.id,
            customer_id=application.customer_id,
            principal_amount=approved_amount,
            interest_rate=affordability.interest_rate,
            term_months=application.loan_term_months,
            monthly_payment=affordability.monthly_payment,
            total_repayment=affordability.total_repayment,
            status=LoanStatus.PENDING_DISBURSEMENT,
            outstanding_balance=affordability.total_repayment
        )
        
        db.add(new_loan)
        
    else:
        # Reject application
        if not decision.rejection_reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rejection reason is required"
            )
        
        application.status = ApplicationStatus.REJECTED
        application.rejection_reason = decision.rejection_reason
        application.reviewed_by = current_user.id
        application.reviewed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    
    return application


@router.put("/{application_id}/status", response_model=LoanApplicationResponse)
def update_application_status(
    application_id: int,
    new_status: ApplicationStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Update application status (Admin only)
    
    Move application to different status (e.g., from submitted to under_review)
    """
    application = db.query(LoanApplication).filter(LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    application.status = new_status
    db.commit()
    db.refresh(application)
    
    return application
