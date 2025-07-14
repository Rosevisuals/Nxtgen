// routes/auth.js - Authentication Routes
// This file defines the URL endpoints for user login and registration
// Think of this as the "entrance" where users check in and get their access cards

// Import required packages
const express = require('express');        // Express framework for creating routes
const router = express.Router();           // Create a new router for authentication routes

// Import the login function from the authentication controller
const { login } = require('../controllers/authController');

// ===== AUTHENTICATION ROUTES =====
// These routes handle user login and registration
// Note: These routes don't require authentication because users need to login first!

// POST /api/auth/login
// This route handles user login
// Example: When someone sends a POST request to http://localhost:5000/api/auth/login
// with username/email and password in the request body
router.post('/login', login);
// - login: Run this function to check credentials and create a login token

// ===== HOW AUTHENTICATION WORKS =====
// 1. User sends username/email and password to /api/auth/login
// 2. The login function checks if the credentials are correct
// 3. If correct, it creates a JWT token and sends it back
// 4. The frontend stores this token and sends it with future requests
// 5. Other routes use the authenticateToken middleware to check this token

// ===== WHY NO AUTHENTICATION MIDDLEWARE HERE =====
// We don't use authenticateToken on login/register routes because:
// - Users need to login BEFORE they can get a token
// - If we required authentication to login, it would be impossible to login!
// - This is a common pattern: authentication routes are public, other routes are protected

// Export the router so it can be used in the main server.js file
module.exports = router;
