"""
Authentication Dependencies
For protecting routes and getting current user
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.core.security import decode_token, verify_token_type
from app.models.models import User, UserRole
from app.schemas.schemas import TokenData


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    
    Usage:
        @app.get("/protected")
        def protected_route(current_user: User = Depends(get_current_user)):
            return {"user": current_user.email}
    """
    token = credentials.credentials
    
    # Decode and validate token
    payload = decode_token(token)
    verify_token_type(payload, "access")
    
    # Extract user data
    user_id: int = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user


def get_current_customer(current_user: User = Depends(get_current_user)) -> User:
    """
    Verify user is a customer
    
    Usage:
        @app.get("/customer-only")
        def customer_route(current_user: User = Depends(get_current_customer)):
            return {"message": "Customer area"}
    """
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    return current_user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Verify user is admin
    
    Usage:
        @app.get("/admin-only")
        def admin_route(current_user: User = Depends(get_current_admin)):
            return {"message": "Admin area"}
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def require_role(*allowed_roles: UserRole):
    """
    Dependency factory for role-based access
    
    Usage:
        @app.get("/admin-or-manager")
        def route(current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.MANAGER))):
            return {"message": "Admin or Manager area"}
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of: {', '.join(r.value for r in allowed_roles)}"
            )
        return current_user
    return role_checker
