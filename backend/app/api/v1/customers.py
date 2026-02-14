"""
Customer API Endpoints
Manage customer profiles and information
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import User, Customer
from app.schemas.schemas import CustomerCreate, CustomerResponse, CustomerUpdate
from app.api.dependencies import get_current_user, get_current_customer, get_current_admin


router = APIRouter()


@router.post("/profile", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer_profile(
    profile_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Create customer profile (KYC information)
    
    Required after registration before applying for loans.
    Customer can only create their own profile.
    """
    # Check if profile already exists
    existing_profile = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer profile already exists"
        )
    
    # Check if ID number already used
    existing_id = db.query(Customer).filter(Customer.id_number == profile_data.id_number).first()
    if existing_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID number already registered"
        )
    
    # Create profile
    new_profile = Customer(
        user_id=current_user.id,
        **profile_data.model_dump()
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return new_profile


@router.get("/profile", response_model=CustomerResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Get current customer's profile
    """
    profile = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found. Please create your profile first."
        )
    
    return profile


@router.put("/profile", response_model=CustomerResponse)
def update_my_profile(
    updates: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    """
    Update customer profile
    
    Only certain fields can be updated after creation.
    """
    profile = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found"
        )
    
    # Update fields
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer_by_id(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Get customer by ID (Admin only)
    """
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return customer


@router.get("/", response_model=List[CustomerResponse])
def list_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    List all customers (Admin only)
    
    - **skip**: Number of records to skip
    - **limit**: Maximum number of records to return
    """
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers
