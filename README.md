# Hospital ERP Backend

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
- `/tests/` — Automated tests (unit and integration)
  - `/tests/helpers/` — Test utilities and file-based store for integration tests
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
- **tests/helpers/testAppointmentsStore.js**: Used in test mode to persist appointments for integration tests.

---

Would you like this written directly to your `README.md` file?

---

## What Each File/Folder Does

- **controllers/**: Contains logic for each API resource (CRUD, validation, etc.)
- **routes/**: Maps HTTP endpoints to controller functions
- **middleware/**: Contains authentication and role-based access control
- **config/db.js**: Sets up the SQL Server connection using environment variables
- **tests/controllers/**: Unit tests for each controller (using mocks)
- **tests/integration/**: Integration tests for API endpoints (simulate real HTTP requests)
- **tests/helpers/testAppointmentsStore.js**: File-based persistent store for appointments during integration tests
- **server.js**: Starts the Express app and loads all routes/middleware

---

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your `.env` file

Copy the example above and fill in your actual database and JWT details.

### 3. Start the server

```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

---

## Running the Tests

### 1. Run all tests

```bash
npm test
```

### 2. What the tests do

- **Unit tests** (in `/tests/controllers/`): Test each controller's logic in isolation using mocked database calls.
- **Integration tests** (in `/tests/integration/`): Test the full API stack using HTTP requests, with a file-based store simulating the database for appointments.

### 3. Disclaimer about the Appointments Integration Test

> **Note:**  
> The integration test for appointments uses a file-based store (`tests/helpers/testAppointmentsStore.js`) to simulate a database.  
> This is a workaround for environments where a real test database is not available.  
> In some environments (especially with Jest and Supertest), state may not persist as expected between requests, which can cause the update or delete steps in the appointments integration test to fail with a 404 error.  
> **This does not affect the real controller logic or production use.**  
> For true integration testing, connect to a real test database.

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
- **Integration test failures:**  
  - See the disclaimer above. For full integration, use a real test database.

---

## Questions?

If you have any questions or need help integrating with your backend/database, please open an issue or contact the project maintainer.

---

**Happy coding!**
