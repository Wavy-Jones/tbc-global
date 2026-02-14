"""
Loans API Endpoints
View and manage active loans
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.db.database import get_db
from app.models.models import User, Loan, LoanStatus
from app.schemas.schemas import LoanResponse
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
