// routes/auth.js - Authentication Routes

const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/authController');

// POST /api/auth/login
// Handles user login with email and password
router.post('/login', login);

// POST /api/auth/register
// Handles user registration with new schema fields
router.post('/register', register);

module.exports = router;
