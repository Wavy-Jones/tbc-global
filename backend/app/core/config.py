"""
TBC Global - Core Configuration
Loads and validates environment variables
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import EmailStr, validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "TBC Global Loan Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    API_V1_PREFIX: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    CORS_CREDENTIALS: bool = True
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # File Upload
    MAX_FILE_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "jpg", "jpeg", "png", "doc", "docx"]
    UPLOAD_DIR: str = "./uploads"
    
    @validator("ALLOWED_EXTENSIONS", pre=True)
    def parse_extensions(cls, v):
        if isinstance(v, str):
            return [ext.strip() for ext in v.split(",")]
        return v
    
    # AWS S3
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "af-south-1"
    S3_BUCKET_NAME: str = ""
    
    # Email
    SENDGRID_API_KEY: str = ""
    EMAIL_FROM: EmailStr = "noreply@tbcglobal.co.za"
    EMAIL_FROM_NAME: str = "TBC Global"
    
    # SMS
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    # BulkSMS (Alternative)
    BULKSMS_USERNAME: str = ""
    BULKSMS_PASSWORD: str = ""
    
    # WhatsApp
    WHATSAPP_FROM: str = ""
    
    # PayFast
    PAYFAST_MERCHANT_ID: str = ""
    PAYFAST_MERCHANT_KEY: str = ""
    PAYFAST_PASSPHRASE: str = ""
    PAYFAST_MODE: str = "sandbox"
    PAYFAST_SANDBOX_URL: str = "https://sandbox.payfast.co.za/eng/process"
    PAYFAST_LIVE_URL: str = "https://www.payfast.co.za/eng/process"
    
    @property
    def payfast_url(self) -> str:
        """Get PayFast URL based on mode"""
        return self.PAYFAST_LIVE_URL if self.PAYFAST_MODE == "live" else self.PAYFAST_SANDBOX_URL
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"
    
    # Sentry
    SENTRY_DSN: str = ""
    
    # Credit Bureau (Optional)
    EXPERIAN_API_KEY: str = ""
    EXPERIAN_API_URL: str = ""
    TRANSUNION_API_KEY: str = ""
    TRANSUNION_API_URL: str = ""
    
    # Business Rules
    MIN_LOAN_AMOUNT: int = 500
    MAX_LOAN_AMOUNT: int = 5500
    MIN_MONTHLY_INCOME: int = 4000
    MAX_DEBT_TO_INCOME_RATIO: float = 0.4
    MIN_CREDIT_SCORE: int = 550
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Frontend URL
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Compliance
    COMPANY_NAME: str = "TBC Global"
    COMPANY_REGISTRATION: str = ""
    NCR_REGISTRATION: str = ""
    CONTACT_EMAIL: EmailStr = "info@tbcglobal.co.za"
    CONTACT_PHONE: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
