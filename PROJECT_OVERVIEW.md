# ERP Healthcare Backend System - Project Overview

## Project Description

This is a comprehensive **Enterprise Resource Planning (ERP) system** designed specifically for healthcare institutions such as hospitals and clinics. The system provides a centralized platform for managing various aspects of healthcare operations including patient records, staff management, appointments, billing, and administrative functions.

## Technology Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: Microsoft SQL Server
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email Services**: Integrated email utility for notifications
- **Testing**: Jest for unit and integration testing

## System Architecture

The backend follows a **Model-View-Controller (MVC)** architecture pattern:

- **Models**: Database interaction layer (SQL Server queries)
- **Controllers**: Business logic and request handling
- **Routes**: API endpoint definitions
- **Middleware**: Authentication and request processing
- **Utils**: Helper functions (email services, etc.)

## Database Schema Overview

The system is built around the following core entities:

### Core Entities I'm Responsible For:
- **Users** - Base user authentication and profile information
- **Staff** - Healthcare staff with roles and specializations
- **Departments** - Organizational units within the healthcare facility
- **Patients** - Patient records and basic information
- **Appointments** - Scheduling system for patient-doctor meetings
- **Billing** - Financial transactions and payment tracking
- **Roles** - Access control and permission management

### Entities Handled by Other Team Members:
- **Diagnosis** - Medical diagnoses and conditions
- **Prescriptions** - Medication orders and prescriptions
- **Lab Requests** - Laboratory test orders and results
- **Wards** - Hospital ward management
- **Beds** - Bed allocation and management

## My Role & Responsibilities

As the **Backend Developer** for the core modules, my responsibilities include:

### 1. **User Management System**
- User registration and authentication
- Password management (setup, reset, forgot password)
- Email verification system
- User profile management
- Integration with staff roles

### 2. **Staff Management**
- Staff registration and profile management
- Role-based access control
- Department assignments
- Specialization tracking
- License management

### 3. **Patient Management**
- Patient registration (both self-service and staff-assisted)
- Patient profile management
- Patient-doctor assignments
- Patient data privacy and security

### 4. **Appointment System**
- Appointment scheduling
- Appointment status management
- Patient-doctor appointment coordination
- Appointment history tracking

### 5. **Billing System**
- Bill creation and management
- Payment status tracking
- Financial record keeping
- Due date management

### 6. **Department Management**
- Department creation and organization
- Staff-department relationships
- Organizational hierarchy

### 7. **Authentication & Security**
- JWT-based authentication
- Role-based authorization
- Secure password handling
- Session management
- API security middleware

### 8. **API Development**
- RESTful API endpoints
- Request validation
- Error handling
- Response formatting
- Documentation

### 9. **Database Management**
- SQL Server database design
- Data model relationships
- Query optimization
- Database connection pooling
- Transaction management

### 10. **Testing & Quality Assurance**
- Unit testing for models and controllers
- Integration testing for API endpoints
- Test data management
- Error scenario testing

## Key Features Implemented

### Authentication Flow:
- **Staff Registration**: Admin creates staff accounts, sends setup email
- **Patient Self-Registration**: Patients can register online with email verification
- **Staff-Assisted Patient Registration**: In-person patient registration with email setup
- **Login System**: Secure authentication with role-based access
- **Password Management**: Forgot password, reset password, setup password flows

### Patient Management:
- Dual registration paths (self-service and staff-assisted)
- Email verification and password setup
- Patient profile management
- Doctor assignment tracking

### Staff Operations:
- Comprehensive staff profiles
- Role and department assignments
- Specialization tracking
- Integration with user authentication

### Appointment Coordination:
- Appointment creation and management
- Patient-doctor scheduling
- Status tracking and updates

### Financial Management:
- Bill generation and tracking
- Payment status monitoring
- Due date management

## Project Status

✅ **Completed Modules:**
- User authentication system
- Staff management
- Patient management
- Appointment system
- Billing system
- Department management
- Role management
- Email notification system

🔄 **In Progress:**
- Advanced reporting features
- Performance optimization
- Enhanced security measures

⏳ **Pending (Other Team Members):**
- Diagnosis module
- Prescription management
- Lab request system
- Ward and bed management

## Development Standards

- **Code Structure**: Modular, maintainable, and well-documented
- **Error Handling**: Comprehensive error management with appropriate HTTP status codes
- **Security**: Input validation, SQL injection prevention, secure authentication
- **Testing**: Unit and integration tests for all major functionalities
- **Documentation**: Clear API documentation and code comments

## Collaboration

This project is part of a larger team effort where I focus on the core operational modules while other developers handle specialized medical modules. The modular architecture ensures clean separation of concerns and easy integration between different components.

---

*Last Updated: July 2025*
*Developer: Hanson*
