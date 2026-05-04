"""
TBC Global - Main Application
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.db.database import engine, Base

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Comprehensive loan management platform for TBC Global",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for security
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.tbcglobal.co.za", "*.vercel.app", "localhost"]
    )


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")

    # Seed admin user if this is a fresh database
    from app.db.database import SessionLocal
    from app.models.models import User, UserRole
    from app.core.security import get_password_hash
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@tbcglobal.co.za").first():
            db.add(User(
                email="admin@tbcglobal.co.za",
                hashed_password=get_password_hash("Admin123!"),
                full_name="Admin User",
                phone_number="+27000000000",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True,
            ))
            db.commit()
            logger.info("Admin user seeded")
    except Exception as e:
        logger.warning(f"Admin seed skipped: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down application")


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - health check"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG
    }


@app.get(f"{settings.API_V1_PREFIX}/", tags=["API Info"])
async def api_info():
    """API information endpoint"""
    return {
        "api_version": "v1",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/docs" if settings.DEBUG else "Contact administrator"
    }


# Include API routers
from app.api.v1 import auth, applications, customers, loans, dashboard

app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Authentication"])
app.include_router(applications.router, prefix=f"{settings.API_V1_PREFIX}/applications", tags=["Loan Applications"])
app.include_router(customers.router, prefix=f"{settings.API_V1_PREFIX}/customers", tags=["Customers"])
app.include_router(loans.router, prefix=f"{settings.API_V1_PREFIX}/loans", tags=["Loans"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_PREFIX}/dashboard", tags=["Dashboard"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
