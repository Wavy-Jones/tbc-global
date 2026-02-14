"""
Database Setup Script
Run this to create all tables and initial data
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.db.database import engine, Base, SessionLocal
from app.models.models import User, Customer, UserRole
from app.core.security import get_password_hash
from datetime import datetime


def create_tables():
    """Create all database tables"""
    print("🔨 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")


def create_admin_user():
    """Create initial admin user"""
    print("👤 Creating admin user...")
    
    db = SessionLocal()
    try:
        # Check if admin exists
        existing_admin = db.query(User).filter(User.email == "admin@tbcglobal.co.za").first()
        if existing_admin:
            print("⚠️  Admin user already exists")
            return
        
        # Create admin user
        admin = User(
            email="admin@tbcglobal.co.za",
            hashed_password=get_password_hash("Admin123!"),
            full_name="Admin User",
            phone_number="+27123456789",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        db.commit()
        
        print("✅ Admin user created!")
        print("   Email: admin@tbcglobal.co.za")
        print("   Password: Admin123!")
        
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()


def create_test_customer():
    """Create test customer for demo"""
    print("👤 Creating test customer...")
    
    db = SessionLocal()
    try:
        # Check if customer exists
        existing = db.query(User).filter(User.email == "john.doe@example.com").first()
        if existing:
            print("⚠️  Test customer already exists")
            return
        
        # Create customer user
        user = User(
            email="john.doe@example.com",
            hashed_password=get_password_hash("Customer123!"),
            full_name="John Doe",
            phone_number="+27821234567",
            role=UserRole.CUSTOMER,
            is_active=True,
            is_verified=True
        )
        db.add(user)
        db.flush()
        
        # Create customer profile
        customer = Customer(
            user_id=user.id,
            id_number="8001015800080",
            date_of_birth=datetime(1980, 1, 1),
            gender="Male",
            nationality="South African",
            street_address="123 Main Street",
            city="Johannesburg",
            province="Gauteng",
            postal_code="2000",
            employer_name="ABC Company",
            employer_phone="+27115551234",
            job_title="Software Developer",
            employment_start_date=datetime(2020, 1, 1),
            monthly_income=15000.00,
            bank_name="FNB",
            account_number="62123456789",
            account_type="Cheque",
            branch_code="250655",
            credit_score=650,
            kyc_verified=True,
            fica_compliant=True
        )
        db.add(customer)
        db.commit()
        
        print("✅ Test customer created!")
        print("   Email: john.doe@example.com")
        print("   Password: Customer123!")
        
    except Exception as e:
        print(f"❌ Error creating customer: {e}")
        db.rollback()
    finally:
        db.close()


def verify_database():
    """Verify database connection"""
    print("🔍 Verifying database connection...")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


def main():
    """Main setup function"""
    print("=" * 50)
    print("TBC Global - Database Setup")
    print("=" * 50)
    print()
    
    # Verify connection
    if not verify_database():
        print("\n❌ Setup failed - check your DATABASE_URL in .env")
        return
    
    # Create tables
    create_tables()
    print()
    
    # Create initial users
    create_admin_user()
    print()
    create_test_customer()
    print()
    
    print("=" * 50)
    print("✅ Setup Complete!")
    print("=" * 50)
    print("\nTest Accounts:")
    print("1. Admin:")
    print("   Email: admin@tbcglobal.co.za")
    print("   Password: Admin123!")
    print("\n2. Customer:")
    print("   Email: john.doe@example.com")
    print("   Password: Customer123!")
    print("\nYou can now start the server:")
    print("   python main.py")
    print()


if __name__ == "__main__":
    main()
