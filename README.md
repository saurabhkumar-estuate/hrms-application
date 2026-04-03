# HRMS Application — Full-Stack Human Resource Management System

A complete, production-ready HRMS (Human Resource Management System) similar to GreyHR, built with **React.js** (frontend) and **Java Spring Boot** (backend).

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Tailwind CSS, Recharts |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database | H2 (dev) / PostgreSQL (prod) |
| Auth | JWT (jjwt 0.11.5) + BCrypt |
| PDF | iText 5 |
| Build | Maven, Vite |
| Docker | Docker + Docker Compose |

---

## 📋 Features

- 👤 **Employee Management** — CRUD, search, filter, department management
- 📅 **Leave Management** — Apply, approve/reject, leave balance tracking
- ⏱️ **Attendance Tracking** — Check-in/check-out, monthly reports
- 💰 **Payroll Processing** — Automated salary computation, payslip PDF download
- 📊 **Reports & Analytics** — Charts for headcount, attendance, leave, payroll
- 🔐 **Role-Based Access Control** — ADMIN, HR_MANAGER, MANAGER, EMPLOYEE
- 📱 **Responsive UI** — Works on mobile and desktop

---

## 🗂️ Project Structure

```
hrms-application/
├── hrms-backend/          # Spring Boot Java backend
│   ├── src/main/java/com/hrms/
│   │   ├── config/        # Security, JWT filter, CORS, DataInitializer
│   │   ├── controller/    # REST API controllers
│   │   ├── service/       # Business logic
│   │   ├── repository/    # JPA repositories
│   │   ├── model/         # JPA entity classes
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── exception/     # Global exception handler
│   │   └── util/          # JwtUtil, PayslipPdfGenerator
│   └── pom.xml
├── hrms-frontend/         # React.js frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # Axios API services
│   │   ├── store/         # Redux Toolkit slices
│   │   └── utils/         # Helper functions
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm 9+
- (Optional) Docker & Docker Compose

---

## 🛠️ Setup Instructions

### Backend

```bash
cd hrms-backend
mvn clean install -DskipTests
mvn spring-boot:run
```

The backend starts at: **http://localhost:8080**

- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

### Frontend

```bash
cd hrms-frontend
npm install
npm run dev
```

The frontend starts at: **http://localhost:3000**

### Docker (Full Stack)

```bash
docker-compose up --build
```

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@hrms.com | admin123 |
| 👔 HR Manager | hr@hrms.com | hr123 |
| 👤 Employee | john.doe@hrms.com | emp123 |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List with pagination/search |
| POST | /api/employees | Create employee |
| GET | /api/employees/{id} | Get by ID |
| PUT | /api/employees/{id} | Update |
| DELETE | /api/employees/{id} | Deactivate |
| GET | /api/employees/departments | All departments |

### Leave
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leaves | All leaves |
| POST | /api/leaves/apply | Apply leave |
| PUT | /api/leaves/{id}/approve | Approve |
| PUT | /api/leaves/{id}/reject | Reject |
| GET | /api/leaves/balance/{employeeId} | Leave balance |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/attendance/checkin | Check in |
| POST | /api/attendance/checkout | Check out |
| GET | /api/attendance/today | Today's records |
| GET | /api/attendance/monthly/{employeeId} | Monthly report |

### Payroll
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payroll/generate/{month}/{year} | Run payroll |
| GET | /api/payroll/all/{month}/{year} | All payrolls |
| GET | /api/payroll/employee/{employeeId} | Employee payrolls |
| GET | /api/payroll/download/{id} | Download PDF payslip |

---

## 📄 Payslip Contents

When an employee downloads a salary slip (PDF), it includes:

- **Company Header** — Company name and branding
- **Employee Details** — Name, code, department, designation, PAN, bank account, PF number
- **Pay Period** — Month and year
- **Earnings Table**
  - Basic Salary (40% of gross)
  - HRA (20% of gross)
  - Special Allowance (20%)
  - Travel Allowance (₹1,600)
  - Medical Allowance (₹1,250)
  - Performance Bonus
- **Deductions Table**
  - Provident Fund / PF (12% of basic)
  - ESI (0.75% if salary ≤ ₹21,000)
  - TDS / Income Tax (as per slab)
  - Professional Tax (₹200)
- **Net Salary** — Prominently displayed
- **Footer** — HR contact info

---

## 🏢 Setting Up in Your Organisation

1. Deploy the backend to a server (cloud or on-premise)
2. Deploy the frontend and point it to the backend URL
3. HR Admin logs in and:
   - Adds employees (automatically generates EMP-XXXX codes and login credentials)
   - Sets up leave policies
   - Runs payroll each month
4. Employees log in and can:
   - View their profile and payslips
   - Apply for leave
   - Mark attendance

---

## 📦 Sample Data (auto-seeded on startup)

- 5 employees across Engineering, HR, Finance, Marketing departments
- Leave balances for each leave type
- 5 days of attendance records
- 3 sample leave requests

---

## 📝 License

MIT