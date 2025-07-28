# ERP Backend

---

## Production Readiness Features (July 2025)

The application has been enhanced with several key features to ensure it is secure, stable, and ready for a production environment.

### What Was Added

-   **Security Headers (`helmet`):**
    -   Automatically sets important HTTP security headers to protect against common web vulnerabilities like Cross-Site Scripting (XSS), clickjacking, and content sniffing.
-   **Rate Limiting (`express-rate-limit`):**
    -   Protects the API from brute-force and denial-of-service attacks by limiting the number of requests an IP address can make in a given time frame (currently 100 requests per 15 minutes).
-   **Centralized Error Handling:**
    -   A new global error handling middleware has been added to `server.js`.
    -   It catches all unhandled errors, logs them, and sends a generic, user-friendly error message to the client in production, preventing sensitive stack traces from being exposed.
-   **Production-Grade Logging (`winston` & `morgan`):**
    -   Replaced `console.log` with a robust logging system.
    -   **`winston`**: Manages log levels and outputs. It creates two log files:
        -   `error.log`: Contains only critical errors.
        -   `combined.log`: Contains all log messages (including HTTP requests).
    -   **`morgan`**: Acts as an HTTP request logger, capturing details about every incoming request and feeding it into `winston`.
-   **Process Management:**
    -   The server now gracefully handles `uncaughtException` and `unhandledRejection` events. Instead of crashing, it will log the fatal error and exit cleanly.

These features make the application more resilient and provide better diagnostics for monitoring and troubleshooting in a live environment.

---

## Module Change Log

This section tracks the addition of new modules to the ERP system.

-   **Users Module:**
    -   **Model:** `models/usersModel.js`
    -   **Controller:** `controllers/usersController.js`
    -   **Route:** `routes/users.js`
-   **Roles Module:**
    -   **Model:** `models/rolesModel.js`
-   **Authentication:**
    -   **Controller:** `controllers/authController.js`
    -   **Route:** `routes/auth.js`
    -   **Middleware:** `middleware/authMiddleware.js`
-   **Patients Module:**
    -   **Model:** `models/patientModel.js`
    -   **Controller:** `controllers/patientsController.js`
    -   **Route:** `routes/patients.js`
-   **Appointments Module:**
    -   **Model:** `models/appointmentsModel.js`
    -   **Controller:** `controllers/appointmentsController.js`
    -   **Route:** `routes/appointments.js`
-   **Departments Module:**
    -   **Model:** `models/departmentModel.js`
    -   **Controller:** `controllers/departmentController.js`
    -   **Route:** `routes/departments.js`
-   **Billing Module:**
    -   **Model:** `models/billingModel.js`
    -   **Controller:** `controllers/billingController.js`
    -   **Route:** `routes/billing.js`
-   **Prescriptions Module:**
    -   **Model:** `models/prescriptionsModel.js`
    -   **Controller:** `controllers/prescriptionsController.js`
    -   **Route:** `routes/prescriptions.js`
-   **Consultation Module:**
    -   **Controller:** `controllers/consultationController.js`
    -   **Route:** `routes/consultation.js`
-   **Pharmacy Module:**
    -   **Route:** `routes/pharmacy.js`
-   **Staff Module:**
    -   **Model:** `models/staffModel.js`
    -   **Controller:** `controllers/staffController.js`
    -   **Route:** `routes/staff.js`


---

## Overview

This is the backend API for the Hospital ERP system built with **Node.js**, **Express**, and **SQL Server**.  
It handles user authentication, patient management, appointments, consultations, pharmacy, finance, store inventory, ward management, and more.

The system follows RESTful API principles and uses **JWT** for secure authentication.

---

## Project Structure

- `/controllers/` — All business logic for each resource (patients, appointments, users, etc.)
- `/routes/` — Express route definitions for each resource
- `/middleware/` — Authentication and authorization middleware
- `/config/` — Database connection and configuration
- `/utils/` — Utility functions (email, etc.)
- `server.js` — Main Express app entry point
- `package.json` — Project dependencies and scripts

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_DATABASE=your_db_name
DB_PORT=1433
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

> **How to get a JWT secret:**  
> You can use any long, random string as your JWT secret. For example, generate one with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```
> Copy the output and set it as `JWT_SECRET` in your `.env` file.  
> **Keep this value private and do not share it publicly. Never commit your `.env` file to version control.**

> **What is JWT?**  
> JWT (JSON Web Token) is a secure, compact way to represent user identity and claims between the client and server.  
> It is used for authentication: after a user logs in, the server issues a signed JWT token, which the client includes in the `Authorization` header for all subsequent API requests.  
> The backend verifies the token using the `JWT_SECRET` to ensure requests are from authenticated users and to check their roles/permissions.

## Email Configuration Setup

The system includes email functionality for:
- **Password Reset**: Users can request password reset links via email
- **Email Verification**: New users receive verification emails
- **Patient Registration**: Staff-created patients receive password setup emails
- **Account Notifications**: Various account-related notifications

### Required Email Environment Variables

Add these to your `.env` file:

```env
FRONTEND_URL=http://localhost:3000  # Your frontend application URL
EMAIL_HOST=smtp.gmail.com          # SMTP server address
EMAIL_PORT=587                     # SMTP port (usually 587 for TLS)
EMAIL_USERNAME=your-email@gmail.com # Your email address
EMAIL_PASSWORD=your-app-password    # App-specific password (NOT your regular password)
```

### Email Provider Setup Instructions

#### Option 1: Gmail (Recommended for Development)

**Important**: Use your **company email account** that will send emails to patients (e.g., `noreply@yourhospital.com`, `info@yourhospital.com`, or `notifications@yourhospital.com`).

1. **Enable 2-Factor Authentication** on your company's Google account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Turn on 2-Step Verification for the company email account

2. **Generate App Password** (NOT your regular email password):
   - In Security settings, find "App passwords"
   - Select "Mail" as the app type
   - Copy the generated 16-character password
   - **This app password is what you'll use in your `.env` file**

3. **Configure `.env`**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=noreply@yourhospital.com  # Your company email
   EMAIL_PASSWORD=abcd efgh ijkl mnop        # App password (NOT regular password)
   ```

**Why App Passwords?**
- App passwords are more secure than regular passwords for automated systems
- They can be revoked independently without changing your main email password
- Required by Gmail for applications that don't support modern authentication

#### Option 2: Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Option 3: Professional Services (Recommended for Production)

**SendGrid**:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USERNAME=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

**Mailgun**:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USERNAME=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

### Testing Email Functionality

1. **Start the server** with email configuration
2. **Test endpoints that trigger emails**:
   - `POST /api/auth/forgot-password` - Send password reset email
   - `POST /api/patients/register` - Send verification email
   - `POST /api/patients` - Send password setup email (staff-created patients)

3. **Check server logs** for email sending status
4. **Verify emails arrive** in the recipient's inbox

### Email Templates

The system currently sends plain text emails. Email content includes:
- **Password Reset**: Link to reset password (expires in 15 minutes)
- **Email Verification**: Link to verify account (expires in 24 hours)
- **Password Setup**: Link for new patients to set their password (expires in 24 hours)

### Security Notes

- **Never commit your `.env` file** to version control
- **Use app-specific passwords**, not your regular email password
- **For production**, use professional email services like SendGrid or Mailgun
- **Email links expire** for security (15 minutes for password reset, 24 hours for other actions)

### Troubleshooting Email Issues

- **"Authentication failed" errors**: Check that you're using an app password, not your regular password
- **"Connection refused" errors**: Verify SMTP host and port settings
- **Emails not arriving**: Check spam/junk folders
- **Gmail blocking**: Ensure 2FA is enabled and you're using an app password

---

## How the Backend Flows (File & Module Overview)

1. **Request comes in via Express route (routes/)**
   - Example: `routes/patients.js` defines `/api/patients` endpoints.
2. **Route calls the appropriate controller function (controllers/)**
   - Example: `getAllPatients` in `controllers/patientsController.js` fetches all patients from the database.
3. **Controller interacts with the database (config/db.js)**
   - Uses the SQL Server connection pool to run queries.
4. **Middleware (middleware/authMiddleware.js) handles authentication/authorization**
   - `authenticateToken` checks JWT tokens for protected routes.
   - `authorizeRoles` restricts access based on user roles.
5. **Response is sent back to the client**
   - Data is returned as JSON, or errors are handled and returned with appropriate status codes.

### Module Example: Patients
- **routes/patients.js**: Defines endpoints like `GET /api/patients`, `POST /api/patients`.
- **controllers/patientsController.js**: Implements logic for fetching, creating, updating, and deleting patients.
- **config/db.js**: Handles the actual database connection and queries.
- **middleware/authMiddleware.js**: Ensures only authenticated users can access patient data.

### Module Example: Appointments
- **routes/appointments.js**: Defines endpoints for appointment CRUD.
- **controllers/appointmentsController.js**: Handles appointment logic, including validation and double-booking checks.

---

## What Each File/Folder Does

- **controllers/**: Contains logic for each API resource (CRUD, validation, etc.)
- **routes/**: Maps HTTP endpoints to controller functions
- **middleware/**: Contains authentication and role-based access control
- **config/db.js**: Sets up the SQL Server connection using environment variables
- **utils/**: Utility functions like email sending
- **server.js**: Starts the Express app and loads all routes/middleware

---

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your `.env` file

Copy the example above and fill in your actual database, email, and JWT details.

### 3. Start the server

```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

---

## How to Integrate with a Real Database (For Backend Developer)

1. **Set up your SQL Server database**  
   - Create a database and user with the necessary permissions.
   - Note the server address, database name, username, and password.

2. **Configure your `.env` file**  
   - Fill in the values for `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_DATABASE`, `DB_PORT`, and `JWT_SECRET`.

3. **Start the backend server**  
   - Run `npm start` (or `npm run dev` for development).
   - The server will connect to the database using the credentials in `.env`.

4. **Verify the connection**  
   - On startup, the server will attempt to connect to the database.
   - Any connection errors will be printed to the console.

5. **API Endpoints**  
   - All endpoints are defined in `/routes/` and handled by `/controllers/`.
   - You can use tools like Postman or curl to test endpoints (e.g., `/api/patients`, `/api/appointments`, etc.).

6. **Authentication**  
   - Register/login endpoints are available at `/api/auth/register` and `/api/auth/login`.
   - Use the JWT token returned from login for authenticated requests.

7. **Extending the Backend**  
   - Add new controllers for new resources in `/controllers/`.
   - Add new routes in `/routes/`.
   - Add new database tables/fields as needed and update the controllers accordingly.

---

## Troubleshooting

- **Database connection errors:**  
  - Double-check your `.env` values and ensure your SQL Server is running and accessible.
- **JWT errors:**  
  - Make sure `JWT_SECRET` is set in your `.env` file.
- **Email errors:**  
  - Verify your email configuration and ensure you're using app passwords for Gmail.

---

## Questions?

If you have any questions or need help integrating with your backend/database, please open an issue or contact the project maintainer.

---

**Happy coding!**
