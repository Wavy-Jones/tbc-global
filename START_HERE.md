# ✅ YOUR TODO LIST - Get Demo Running NOW!

## RIGHT NOW (Next 30 Minutes):

### ☐ 1. Install PostgreSQL (if not installed)
- Download: https://www.postgresql.org/download/windows/
- Install with password: `postgres123`
- Takes 10-15 minutes

### ☐ 2. Create Database
```bash
psql -U postgres
CREATE DATABASE tbc_loans;
\q
```

### ☐ 3. Setup Python Environment
```bash
cd C:\Repos\TBC\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### ☐ 4. Configure .env
```bash
copy .env.example .env
notepad .env
```
- Update DATABASE_URL
- Generate and set SECRET_KEY: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Save and close

### ☐ 5. Initialize Database
```bash
python -m app.db.setup_db
```

### ☐ 6. Start Server
```bash
python main.py
```

### ☐ 7. Test API
- Open: http://localhost:8000/docs
- Login as admin: admin@tbcglobal.co.za / Admin123!
- Test endpoints!

---

## ✅ WHAT'S WORKING:

**Authentication:**
- ✅ Register
- ✅ Login
- ✅ JWT tokens

**Customer Features:**
- ✅ Create profile
- ✅ Apply for loan
- ✅ View my applications
- ✅ View my loans

**Admin Features:**
- ✅ View all applications
- ✅ Approve/Reject applications
- ✅ View dashboard stats
- ✅ View all loans
- ✅ View all customers

**Business Logic:**
- ✅ Affordability calculator
- ✅ Interest rate calculation (15% annual)
- ✅ Monthly payment calculation
- ✅ Automatic loan creation on approval

---

## 🎯 DEMO FLOW:

1. **Admin Login** → Dashboard shows 0 applications
2. **Register Customer** → Create profile
3. **Apply for Loan** → R3000 for 6 months
4. **Admin Views** → Application appears
5. **Admin Approves** → Loan created
6. **Customer Views** → Sees approved loan

**DEMO TIME: 5-7 minutes**

---

## 📊 TEST ACCOUNTS:

**Admin:**
- Email: admin@tbcglobal.co.za
- Password: Admin123!

**Test Customer:**
- Email: john.doe@example.com
- Password: Customer123!

---

## 📞 IF STUCK:

**Can't connect to database?**
```bash
# Check PostgreSQL is running
services.msc

# Verify in .env:
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/tbc_loans
```

**Module not found?**
```bash
# Activate venv
venv\Scripts\activate

# Reinstall
pip install -r requirements.txt
```

**Port in use?**
```bash
# Use different port
python main.py --port 8001
```

---

## 📁 IMPORTANT FILES:

```
C:\Repos\TBC\
├── FAST_DEMO_SETUP.md  ← FULL SETUP GUIDE
├── backend\
│   ├── .env             ← YOUR CONFIGURATION
│   ├── main.py          ← START SERVER HERE
│   └── app\db\setup_db.py  ← INITIALIZE DATABASE
```

---

## 🚀 YOU HAVE:

✅ Complete API (8 endpoints groups)  
✅ Database models (7 tables)  
✅ Authentication & authorization  
✅ Loan application workflow  
✅ Admin dashboard  
✅ Test data  
✅ API documentation  

**EVERYTHING YOU NEED FOR DEMO! 🎉**

---

**Time needed:** 30 minutes  
**Demo length:** 5-7 minutes  
**Status:** READY TO GO! ✅

---

Read **FAST_DEMO_SETUP.md** for step-by-step details!
