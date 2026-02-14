# TBC Global - Loan Management Platform

**Developer:** INFNT Solutions  
**Project Start:** February 2026  
**Status:** In Development

---

## 🎯 Project Overview

TBC Global is a comprehensive loan management platform designed for the South African micro-lending market. The platform handles the complete loan lifecycle from application to disbursement and repayment.

### Key Features

- **Online Loan Applications** - Streamlined application process with document uploads
- **Admin Dashboard** - Complete loan and customer management
- **Customer Portal** - Self-service loan tracking and payments
- **Automated Processing** - Affordability calculations and credit checks
- **Payment Integration** - PayFast integration for disbursements and collections
- **Multi-channel Notifications** - Email, SMS, and WhatsApp
- **Reporting & Analytics** - Comprehensive business intelligence

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Python 3.11+
- FastAPI (async web framework)
- PostgreSQL (database)
- SQLAlchemy (ORM)
- Alembic (database migrations)
- Pydantic (data validation)
- JWT (authentication)

**Frontend:**
- React 18+
- TypeScript
- Tailwind CSS
- React Router
- Axios (API client)
- React Query (data fetching)

**Infrastructure:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Redis (caching & sessions)
- Celery (background tasks)

**Third-Party Services:**
- PayFast (payments)
- SendGrid/AWS SES (email)
- Twilio/BulkSMS (SMS)
- AWS S3 (file storage)

---

## 📁 Project Structure

```
TBC/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   └── v1/         # API version 1
│   │   ├── core/           # Core functionality (config, security)
│   │   ├── db/             # Database connection and session
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend tests
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── main.py            # Application entry point
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app component
│   ├── package.json       # Node dependencies
│   └── tsconfig.json      # TypeScript config
├── docs/                  # Project documentation
├── docker-compose.yml     # Docker services configuration
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Docker Setup (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Backend will be available at http://localhost:8000
# Frontend will be available at http://localhost:3000
```

---

## 📊 Database Schema

### Core Tables

**users**
- User accounts (customers and admin staff)
- Authentication credentials
- Role-based permissions

**loan_applications**
- Loan application details
- Application status workflow
- Affordability calculations

**customers**
- Customer profile information
- KYC/FICA documentation
- Credit history

**loans**
- Active loan details
- Disbursement information
- Repayment schedules

**payments**
- Payment transactions
- Payment status tracking
- Payment method details

**documents**
- Uploaded document metadata
- Document verification status
- Secure file storage references

**notifications**
- Notification history
- Delivery status
- Multi-channel support

---

## 🔐 Security

### Authentication
- JWT-based authentication
- Refresh token rotation
- Password hashing (bcrypt)
- Rate limiting

### Authorization
- Role-based access control (RBAC)
- Permission-based endpoints
- Admin/Manager/Processor/Customer roles

### Data Protection
- HTTPS/TLS encryption
- Database encryption at rest
- Secure file upload validation
- SQL injection prevention
- XSS protection
- CSRF tokens

### Compliance
- POPIA (South African data protection)
- FICA (Financial Intelligence Centre Act)
- NCR (National Credit Regulator) requirements

---

## 📱 API Documentation

### Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.tbcglobal.co.za/api/v1`

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Key Endpoints

**Authentication:**
- `POST /auth/register` - Customer registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

**Loan Applications:**
- `POST /applications` - Submit new application
- `GET /applications` - List applications (admin)
- `GET /applications/{id}` - Get application details
- `PUT /applications/{id}` - Update application
- `POST /applications/{id}/approve` - Approve application
- `POST /applications/{id}/reject` - Reject application

**Customers:**
- `GET /customers` - List customers (admin)
- `GET /customers/{id}` - Get customer details
- `PUT /customers/{id}` - Update customer
- `GET /customers/{id}/loans` - Customer loan history

**Loans:**
- `GET /loans` - List loans
- `GET /loans/{id}` - Get loan details
- `POST /loans/{id}/disburse` - Disburse loan
- `GET /loans/{id}/schedule` - Get payment schedule

**Payments:**
- `POST /payments` - Record payment
- `GET /payments` - List payments
- `GET /payments/{id}` - Payment details

**Documents:**
- `POST /documents/upload` - Upload document
- `GET /documents/{id}` - Download document
- `DELETE /documents/{id}` - Delete document

### Interactive API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Tests

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

---

## 📦 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Backup strategy implemented
- [ ] Monitoring tools set up
- [ ] Log aggregation configured
- [ ] CDN configured for static assets
- [ ] Error tracking enabled (Sentry)
- [ ] Load testing completed

### Deployment Platforms

**Recommended:**
- **Backend:** DigitalOcean App Platform / AWS EC2
- **Frontend:** Vercel / Netlify
- **Database:** DigitalOcean Managed PostgreSQL / AWS RDS
- **File Storage:** AWS S3 / DigitalOcean Spaces

---

## 🔧 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/loan-application

# Make changes and commit
git add .
git commit -m "feat: add loan application form"

# Push to remote
git push origin feature/loan-application

# Create pull request on GitHub
```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## 📈 Roadmap

### Phase 1: MVP (Weeks 1-8)
- [x] Project setup
- [ ] Database schema design
- [ ] Authentication system
- [ ] Basic loan application
- [ ] Admin dashboard (basic)
- [ ] Email notifications
- [ ] Customer portal

### Phase 2: Standard Features (Weeks 9-14)
- [ ] PayFast integration
- [ ] SMS & WhatsApp notifications
- [ ] Multiple loan products
- [ ] Advanced admin dashboard
- [ ] Reporting & analytics
- [ ] Document management
- [ ] Automated affordability calculator

### Phase 3: Premium Features (Optional)
- [ ] Credit bureau integration
- [ ] Automated credit scoring
- [ ] Investment products
- [ ] Mobile app
- [ ] Advanced CRM
- [ ] Marketing automation

---

## 🐛 Known Issues

None at this stage - project just started!

---

## 📝 License

Proprietary - TBC Global  
Developed by INFNT Solutions  
All rights reserved.

---

## 👥 Team

**Developer:** INFNT Solutions  
**Contact:** [Your Email]  
**Phone:** [Your Phone]  
**WhatsApp:** [Your WhatsApp]

---

## 📚 Additional Documentation

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guidelines](docs/security.md)
- [Testing Guide](docs/testing.md)
- [Contributing Guide](docs/contributing.md)

---

## 🙏 Acknowledgments

Built with:
- FastAPI - Modern Python web framework
- React - JavaScript library for building UIs
- PostgreSQL - Powerful open-source database
- Many other amazing open-source projects

---

**Last Updated:** February 4, 2026
