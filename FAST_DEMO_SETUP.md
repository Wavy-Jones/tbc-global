# 🚀 FAST DEMO SETUP GUIDE
## Get TBC Global Running in 30 Minutes!

---

## ✅ What We've Built (100% Complete!)

**Backend API (Fully Functional!):**
- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Customer Profile Management
- ✅ Loan Application System
- ✅ Affordability Calculator
- ✅ Admin Dashboard
- ✅ Application Review & Approval
- ✅ Loan Management

**Database:**
- ✅ All 7 tables defined
- ✅ Relationships configured
- ✅ Seed data ready

---

## 🎯 Quick Demo Flow

1. **Admin Login** → View Dashboard
2. **Customer Registration** → Create Profile → Apply for Loan
3. **Admin Reviews** → Approve/Reject
4. **Customer Views** → Approved Loan

---

## 📋 STEP-BY-STEP SETUP

### STEP 1: Install PostgreSQL (15 min)

**Download:**
https://www.postgresql.org/download/windows/

**Install with these settings:**
- Port: 5432
- Password: `postgres123` (remember this!)
- Locale: Default

**Verify Installation:**
```bash
# Open Command Prompt
psql --version
# Should show: psql (PostgreSQL) 14.x or 15.x
```

---

### STEP 2: Create Database (2 min)

**Open Command Prompt and run:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Enter password when prompted: postgres123

# Create database
CREATE DATABASE tbc_loans;

# Verify
\l

# Exit
\q
```

---

### STEP 3: Setup Backend (10 min)

**Open Command Prompt:**
```bash
# Navigate to backend
cd C:\Repos\TBC\backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# You should see (venv) in your prompt

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies (this will take a few minutes)
pip install -r requirements.txt
```

---

### STEP 4: Configure Environment (2 min)

**Copy and edit .env file:**
```bash
# Still in C:\Repos\TBC\backend
copy .env.example .env
```

**Edit .env file (use Notepad):**
```bash
# Open in Notepad
notepad .env
```

**Change these lines:**
```ini
# Database - UPDATE THIS!
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tbc_loans

# Security - GENERATE A NEW SECRET KEY!
SECRET_KEY=your-secret-key-change-this-to-something-random-and-long

# Debug
DEBUG=True
ENVIRONMENT=development

# CORS - Allow frontend
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Everything else can stay as is for demo
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output and paste it as your SECRET_KEY in .env

**Save and close .env**

---

### STEP 5: Setup Database Tables & Test Data (2 min)

```bash
# Still in C:\Repos\TBC\backend with (venv) active

# Run database setup script
python -m app.db.setup_db
```

**You should see:**
```
==================================================
TBC Global - Database Setup
==================================================

🔍 Verifying database connection...
✅ Database connection successful!
🔨 Creating database tables...
✅ Tables created successfully!

👤 Creating admin user...
✅ Admin user created!
   Email: admin@tbcglobal.co.za
   Password: Admin123!

👤 Creating test customer...
✅ Test customer created!
   Email: john.doe@example.com
   Password: Customer123!

==================================================
✅ Setup Complete!
==================================================
```

---

### STEP 6: Start the Server! (1 min)

```bash
# Still in C:\Repos\TBC\backend with (venv) active

python main.py
```

**You should see:**
```
INFO:     Will watch for changes in these directories: ['C:\\Repos\\TBC\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**🎉 YOUR API IS NOW RUNNING!**

---

## 🧪 TEST THE API (5 min)

### Open your browser to:
**http://localhost:8000/docs**

You should see the **Swagger UI** with all endpoints!

---

### Test 1: Health Check
Click on **GET /** → **Try it out** → **Execute**

**Response (200):**
```json
{
  "app": "TBC Global Loan Platform",
  "version": "1.0.0",
  "status": "healthy",
  "environment": "development"
}
```

---

### Test 2: Admin Login

1. Find **POST /api/v1/auth/login**
2. Click **Try it out**
3. Enter:
```json
{
  "email": "admin@tbcglobal.co.za",
  "password": "Admin123!"
}
```
4. Click **Execute**

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

**🎉 COPY THE access_token!**

---

### Test 3: Authorize

1. Click the **Authorize** button (top right with lock icon)
2. Paste your access_token
3. Click **Authorize**
4. Click **Close**

**Now you're authenticated as admin!**

---

### Test 4: View Dashboard Stats

1. Find **GET /api/v1/dashboard/stats**
2. Click **Try it out**
3. Click **Execute**

**Response (200):**
```json
{
  "total_applications": 0,
  "pending_applications": 0,
  "approved_applications": 0,
  "rejected_applications": 0,
  "active_loans": 0,
  "total_disbursed": 0,
  "total_outstanding": 0,
  "default_rate": 0
}
```

---

### Test 5: Customer Registration

1. Click **Authorize** → **Logout** (to test as new customer)
2. Find **POST /api/v1/auth/register**
3. Click **Try it out**
4. Enter:
```json
{
  "email": "test@example.com",
  "password": "Test123!",
  "full_name": "Test Customer",
  "phone_number": "+27821234567"
}
```
5. Click **Execute**

**Response (201):**
```json
{
  "id": 3,
  "email": "test@example.com",
  "full_name": "Test Customer",
  "phone_number": "+27821234567",
  "role": "customer",
  "is_active": true,
  "is_verified": false,
  "created_at": "2026-02-04T..."
}
```

---

### Test 6: Customer Login

1. Find **POST /api/v1/auth/login**
2. Enter new customer credentials
3. **Copy the access_token**
4. **Authorize** with it

---

### Test 7: Create Customer Profile

1. Find **POST /api/v1/customers/profile**
2. Click **Try it out**
3. Enter:
```json
{
  "id_number": "9001015800080",
  "date_of_birth": "1990-01-01T00:00:00",
  "gender": "Female",
  "nationality": "South African",
  "street_address": "456 Oak Avenue",
  "city": "Pretoria",
  "province": "Gauteng",
  "postal_code": "0001",
  "employer_name": "XYZ Corporation",
  "employer_phone": "+27115554321",
  "job_title": "Marketing Manager",
  "employment_start_date": "2019-06-01T00:00:00",
  "monthly_income": 18000,
  "bank_name": "ABSA",
  "account_number": "1234567890",
  "account_type": "Savings",
  "branch_code": "632005"
}
```
4. Click **Execute**

**Profile created!**

---

### Test 8: Apply for Loan

1. Find **POST /api/v1/applications/**
2. Click **Try it out**
3. Enter:
```json
{
  "requested_amount": 3000,
  "loan_term_months": 6,
  "purpose": "Emergency medical expenses"
}
```
4. Click **Execute**

**Response (201):**
```json
{
  "id": 1,
  "application_number": "TBC-20260204-ABC123",
  "customer_id": 2,
  "requested_amount": 3000,
  "loan_term_months": 6,
  "status": "submitted",
  "affordability_score": 85.5,
  "monthly_payment": 529.78,
  "total_repayment": 3178.68,
  "interest_rate": 0.15,
  ...
}
```

**🎉 LOAN APPLICATION SUBMITTED!**

---

### Test 9: Admin Reviews Application

1. **Logout** → **Login as admin** → **Authorize**
2. Find **GET /api/v1/applications/**
3. Click **Execute** → See the submitted application!

4. Find **POST /api/v1/applications/{application_id}/review**
5. Use application_id = 1
6. Enter:
```json
{
  "approved": true,
  "approved_amount": 3000
}
```
7. Click **Execute**

**Application approved! Loan created!**

---

### Test 10: View Approved Loan

1. Find **GET /api/v1/loans/**
2. Click **Execute**
3. **See the active loan!**

---

## 🎉 DEMO READY!

You now have a **fully functional** loan management system:

✅ User registration & login  
✅ Customer profiles  
✅ Loan applications  
✅ Affordability calculations  
✅ Admin approval workflow  
✅ Loan management  
✅ Dashboard statistics  

---

## 📱 Demo Script for Client

### 1. Show Admin Dashboard (2 min)
- Open http://localhost:8000/docs
- Login as admin
- Show dashboard stats
- Show list of applications

### 2. Show Customer Journey (3 min)
- Register new customer
- Create profile
- Apply for loan (show affordability check)
- Show "submitted" status

### 3. Show Admin Approval (2 min)
- As admin, view application
- Review details (affordability score, monthly payment)
- Approve application
- Show loan created

### 4. Show Customer View (1 min)
- As customer, view approved loan
- Show loan details, payment schedule

### 5. Explain Next Steps (2 min)
- Frontend development
- Payment integration
- Email notifications
- Document uploads
- Etc.

---

## 🐛 Troubleshooting

### Error: "ModuleNotFoundError"
```bash
# Make sure venv is activated
venv\Scripts\activate

# Reinstall requirements
pip install -r requirements.txt
```

### Error: "could not connect to server"
```bash
# Make sure PostgreSQL is running
# Windows: Check Services (postgres should be running)

# Verify connection
psql -U postgres -d tbc_loans
```

### Error: "Invalid token" in Swagger
```bash
# You need to re-authorize
# Click Authorize → Logout → Login again → Get new token
```

### Port 8000 already in use
```bash
# Kill the process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
uvicorn main:app --port 8001
```

---

## 📞 Support

If you get stuck:
1. Check error message carefully
2. Check .env configuration
3. Check database is running
4. Check virtual environment is activated

---

## 🎯 Summary

**Time to demo:** 30 minutes  
**What works:** Everything essential for demo  
**What's next:** Frontend, payments, notifications  

**You're ready to impress the client! 🚀**

---

**Created by INFNT Solutions**  
**Date:** February 4, 2026  
**Status:** Demo Ready ✅
