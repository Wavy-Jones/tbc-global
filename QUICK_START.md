# TBC Global - Quick Start Guide

## 🚀 Getting Started with Development

### Prerequisites Checklist

- [ ] Python 3.11 or higher installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## Step 1: Database Setup

### Install PostgreSQL (if not installed)

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install and remember your postgres password

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE tbc_loans;

-- Create user (optional but recommended)
CREATE USER tbc_admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE tbc_loans TO tbc_admin;

-- Exit
\q
```

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd C:\Repos\TBC\backend
```

### 2.2 Create Virtual Environment

```bash
# Create venv
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### 2.3 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 2.4 Configure Environment Variables

```bash
# Copy example env file
copy .env.example .env

# Edit .env file with your settings
# IMPORTANT: Update these values:
# - DATABASE_URL
# - SECRET_KEY (generate a secure random string)
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.5 Initialize Database

```bash
# Create alembic migration
alembic init alembic

# Or if you want to use the models directly (development only):
# Will create tables from models.py
python -c "from app.db.database import engine, Base; from app.models import models; Base.metadata.create_all(bind=engine)"
```

### 2.6 Run Development Server

```bash
# Start FastAPI server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Your backend should now be running at:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Step 3: Frontend Setup (Coming Soon)

```bash
cd C:\Repos\TBC\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Step 4: Verify Installation

### Test Backend

1. Open browser to http://localhost:8000
2. You should see:
```json
{
  "app": "TBC Global Loan Platform",
  "version": "1.0.0",
  "status": "healthy"
}
```

3. Check API docs at http://localhost:8000/docs

### Test Database Connection

```bash
# In Python
python

>>> from app.db.database import engine
>>> from sqlalchemy import text
>>> with engine.connect() as conn:
...     result = conn.execute(text("SELECT 1"))
...     print(result.fetchone())
(1,)
>>> exit()
```

---

## Common Issues & Solutions

### Issue: ModuleNotFoundError

**Solution:**
```bash
# Make sure you're in the backend directory
cd C:\Repos\TBC\backend

# Make sure venv is activated
venv\Scripts\activate

# Reinstall requirements
pip install -r requirements.txt
```

### Issue: Database connection failed

**Solution:**
```bash
# Check PostgreSQL is running
# Windows:
services.msc  # Look for PostgreSQL service

# Mac:
brew services list

# Verify DATABASE_URL in .env is correct
# Format: postgresql://username:password@localhost:5432/database_name
```

### Issue: Port 8000 already in use

**Solution:**
```bash
# Use a different port
uvicorn main:app --reload --port 8001

# Or find and kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

---

## Development Workflow

### Daily Workflow

1. **Start your day:**
```bash
cd C:\Repos\TBC\backend
venv\Scripts\activate
git pull origin main
python main.py
```

2. **Work on features:**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... code ...

# Test your changes
pytest

# Commit
git add .
git commit -m "feat: add your feature description"

# Push
git push origin feature/your-feature-name
```

3. **End of day:**
```bash
# Make sure everything is committed
git status

# Deactivate venv
deactivate
```

### Testing Changes

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_auth.py -v
```

---

## Next Steps

1. **Set up Alembic migrations:**
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

2. **Create first admin user** (manual for now)

3. **Start building API endpoints** in `app/api/v1/`

4. **Set up frontend** when backend basics are done

---

## Useful Commands

```bash
# Backend

# Install new package
pip install package-name
pip freeze > requirements.txt

# Database
alembic revision -m "description"
alembic upgrade head
alembic downgrade -1

# Testing
pytest
pytest --cov=app --cov-report=html
pytest -v -s  # verbose with print statements

# Code formatting
black app/
isort app/
flake8 app/

# Run production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Project Structure Quick Reference

```
backend/
├── app/
│   ├── api/v1/          # API endpoints (TODO)
│   ├── core/            # Config, security ✅
│   ├── db/              # Database setup ✅
│   ├── models/          # SQLAlchemy models ✅
│   ├── schemas/         # Pydantic schemas (TODO)
│   ├── services/        # Business logic (TODO)
│   └── utils/           # Helper functions (TODO)
├── tests/               # Test files (TODO)
├── .env                 # Environment variables (create from .env.example)
├── main.py              # Application entry ✅
└── requirements.txt     # Dependencies ✅
```

---

## Getting Help

If you encounter issues:

1. Check this guide first
2. Check the main README.md
3. Google the error message
4. Check FastAPI docs: https://fastapi.tiangolo.com
5. Check SQLAlchemy docs: https://docs.sqlalchemy.org

---

**Ready to build! 🚀**

Contact INFNT Solutions for support:
- Email: [Your Email]
- Phone: [Your Phone]
- WhatsApp: [Your WhatsApp]
