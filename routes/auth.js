// routes/auth.js - Authentication Routes

const express = require('express');
const router = express.Router();

const { login, register, setupPassword, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');

// POST /api/auth/login
// Handles user login with email and password
router.post('/login', login);

// POST /api/auth/register
// Handles user registration with new schema fields
router.post('/register', register);

// POST /api/auth/setup-password
// Handles the initial password setup from the email link
router.post('/setup-password', setupPassword);

// GET /api/auth/verify-email/:token
// Handles email verification to activate a new user account
router.get('/verify-email/:token', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;
