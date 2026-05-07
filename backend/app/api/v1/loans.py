"""
Loans API Endpoints
View and manage active loans
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime, timedelta
import uuid

from app.db.database import get_db
from app.models.models import User, Loan, LoanStatus, Payment, PaymentStatus
from app.schemas.schemas import LoanResponse, PaymentCreate, PaymentResponse
from app.api.dependencies import get_current_user, get_current_customer, get_current_admin


router = APIRouter()


@router.get("/my-loans", response_model=List[LoanResponse])
def get_my_loans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Get all loans for current customer
    """
    # Get customer ID
    from app.models.models import Customer
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found"
        )
    
    loans = db.query(Loan)\
        .filter(Loan.customer_id == customer.id)\
        .order_by(desc(Loan.created_at))\
        .all()
    
    return loans


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get loan by ID
    
    Customers can only view their own loans.
    Admins can view all loans.
    """
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    # Check authorization for customers
    if current_user.role.value == "customer":
        from app.models.models import Customer
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer or loan.customer_id != customer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this loan"
            )
    
    return loan


@router.get("/", response_model=List[LoanResponse])
def list_loans(
    status_filter: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    List all loans (Admin only)
    
    - **status**: Filter by status (active, pending_disbursement, paid_off, defaulted)
    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    query = db.query(Loan)
    
    if status_filter:
        try:
            status_enum = LoanStatus(status_filter)
            query = query.filter(Loan.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    loans = query.order_by(desc(Loan.created_at)).offset(skip).limit(limit).all()
    return loans


@router.get("/{loan_id}/payments", response_model=List[PaymentResponse])
def get_loan_payments(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """List all payments for a loan (Admin only)"""
    if not db.query(Loan).filter(Loan.id == loan_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")
    payments = db.query(Payment).filter(Payment.loan_id == loan_id).order_by(desc(Payment.payment_date)).all()
    return payments


@router.post("/{loan_id}/payment", response_model=LoanResponse)
def record_payment(
    loan_id: int,
    data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Record a repayment against a loan (Admin only)"""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")
    if loan.status not in [LoanStatus.ACTIVE, LoanStatus.PENDING_DISBURSEMENT]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Loan is not active")

    # Proportional interest/principal split based on original loan terms
    if loan.total_repayment > loan.principal_amount:
        interest_ratio = (loan.total_repayment - loan.principal_amount) / loan.total_repayment
    else:
        interest_ratio = 0.0
    interest_portion = round(data.amount * interest_ratio, 2)
    principal_portion = round(data.amount - interest_portion, 2)

    ref = f"PAY-{datetime.now().strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:6].upper()}"
    payment = Payment(
        payment_reference=ref,
        loan_id=loan_id,
        amount=data.amount,
        payment_date=datetime.utcnow(),
        payment_method=data.payment_method,
        status=PaymentStatus.COMPLETED,
        principal_amount=principal_portion,
        interest_amount=interest_portion,
        processed_at=datetime.utcnow(),
    )
    db.add(payment)

    # Update loan balances
    loan.outstanding_balance = max(0.0, round(loan.outstanding_balance - data.amount, 2))
    loan.principal_paid = round((loan.principal_paid or 0) + principal_portion, 2)
    loan.interest_paid = round((loan.interest_paid or 0) + interest_portion, 2)

    if loan.status == LoanStatus.PENDING_DISBURSEMENT:
        loan.status = LoanStatus.ACTIVE
        loan.disbursement_date = datetime.utcnow()
        loan.next_payment_date = datetime.utcnow() + timedelta(days=30)
    elif loan.next_payment_date:
        loan.next_payment_date = loan.next_payment_date + timedelta(days=30)

    if loan.outstanding_balance <= 0:
        loan.status = LoanStatus.PAID_OFF
        loan.closed_at = datetime.utcnow()

    db.commit()
    db.refresh(loan)
    return loan


@router.put("/{loan_id}/status", response_model=LoanResponse)
def update_loan_status(
    loan_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update loan status (Admin only)"""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")
    try:
        loan.status = LoanStatus(new_status)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status: {new_status}")

    if loan.status == LoanStatus.ACTIVE and not loan.disbursement_date:
        loan.disbursement_date = datetime.utcnow()
        loan.next_payment_date = datetime.utcnow() + timedelta(days=30)
    elif loan.status == LoanStatus.PAID_OFF:
        loan.closed_at = datetime.utcnow()
        loan.outstanding_balance = 0.0

    db.commit()
    db.refresh(loan)
    return loan
