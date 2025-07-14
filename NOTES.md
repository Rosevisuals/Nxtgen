# Development & Testing Notes

## Common Errors and How They Were Fixed

### 1. Missing Dependencies (e.g., bcrypt, jsonwebtoken)
- **Error:** Module not found or cannot resolve 'bcrypt' or 'jsonwebtoken'.
- **Fix:** Installed missing dependencies using `npm install bcrypt jsonwebtoken`.

### 2. Controllers Missing Exported Functions
- **Error:** Route/controller import errors, e.g., 'getAllPatients is not a function'.
- **Fix:** Ensured all controller functions are exported in their respective files and imported correctly in routes.

### 3. Test Files Referencing Undefined Mock Database Classes
- **Error:** Tests failed due to undefined or mismatched mock DB methods.
- **Fix:** Updated test files to mock the DB methods used in controllers, returning the correct data structure.

### 4. Property Name Mismatches
- **Error:** Tests expected properties like `full_name`, `patient_id`, but controllers returned `name`, `id`, etc.
- **Fix:** Standardized property names in both controllers and tests to match expectations.

### 5. Route Files Using Outdated Middleware Names
- **Error:** Used `checkRole` or `verifyToken` instead of `authorizeRoles` or `authenticateToken`.
- **Fix:** Updated all route files to use the correct middleware names as exported from `middleware/authMiddleware.js`.

### 6. Mock DBs Not Returning the Correct Structure or Handling 'Not Found' Cases
- **Error:** Tests failed with 404/400 errors or incorrect data shape.
- **Fix:** Updated mock DBs to return objects with the expected properties and to simulate 'not found' by tracking the last input value for IDs.

### 7. POST/PUT Tests Using Incorrect Fields
- **Error:** Tests sent fields like `name` instead of `username`, or `type` instead of `cashier_id`.
- **Fix:** Updated test data and expectations to match controller requirements.

### 8. Integration Test Port Conflict
- **Error:** `EADDRINUSE: address already in use :::5000` when running tests.
- **Fix:** Updated `server.js` to only call `app.listen` if not in test mode, so Supertest can use the app directly.

### 9. Appointments Integration Test Fails with 404
- **Error:** Update/delete steps in the appointments integration test failed with 404 due to in-memory/file-based state not persisting between requests.
- **Fix:** Switched to a file-based persistent store for test appointments. Added logs and debug steps. **Note:** This is a limitation of the test environment, not the controller logic.

### 10. JWT Secret Not Set or Not Understood
- **Error:** JWT authentication failed or was unclear to backend devs.
- **Fix:** Added clear README instructions on how to generate a secure JWT secret and what JWT is.

---

**For any new errors, check the logs, review the README, and ensure all environment variables and dependencies are set up correctly.** 