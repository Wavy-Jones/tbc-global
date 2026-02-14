"""
Dashboard API Endpoints
Admin dashboard statistics and overview
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.models.models import User, LoanApplication, Loan, ApplicationStatus, LoanStatus
from app.schemas.schemas import DashboardStats
from app.api.dependencies import get_current_admin


router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Get dashboard statistics (Admin only)
    
    Returns:
    - Total applications
    - Pending applications
    - Approved applications
    - Rejected applications
    - Active loans
    - Total disbursed amount
    - Total outstanding balance
    - Default rate
    """
    # Application stats
    total_applications = db.query(LoanApplication).count()
    pending_applications = db.query(LoanApplication)\
        .filter(LoanApplication.status.in_([ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW]))\
        .count()
    approved_applications = db.query(LoanApplication)\
        .filter(LoanApplication.status == ApplicationStatus.APPROVED)\
        .count()
    rejected_applications = db.query(LoanApplication)\
        .filter(LoanApplication.status == ApplicationStatus.REJECTED)\
        .count()
    
    # Loan stats
    active_loans = db.query(Loan)\
        .filter(Loan.status == LoanStatus.ACTIVE)\
        .count()
    
    total_disbursed = db.query(func.sum(Loan.principal_amount))\
        .filter(Loan.status.in_([LoanStatus.ACTIVE, LoanStatus.PAID_OFF]))\
        .scalar() or 0.0
    
    total_outstanding = db.query(func.sum(Loan.outstanding_balance))\
        .filter(Loan.status == LoanStatus.ACTIVE)\
        .scalar() or 0.0
    
    defaulted_loans = db.query(Loan)\
        .filter(Loan.status == LoanStatus.DEFAULTED)\
        .count()
    
    total_loans = db.query(Loan)\
        .filter(Loan.status.in_([LoanStatus.ACTIVE, LoanStatus.PAID_OFF, LoanStatus.DEFAULTED]))\
        .count()
    
    default_rate = (defaulted_loans / total_loans * 100) if total_loans > 0 else 0.0
    
    return DashboardStats(
        total_applications=total_applications,
        pending_applications=pending_applications,
        approved_applications=approved_applications,
        rejected_applications=rejected_applications,
        active_loans=active_loans,
        total_disbursed=round(total_disbursed, 2),
        total_outstanding=round(total_outstanding, 2),
        default_rate=round(default_rate, 2)
    )
