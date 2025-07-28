// routes/patients.js - Patient Registration Routes

const express = require('express');
const router = express.Router();

const { registerPatient } = require('../controllers/patientsController');

// POST /api/patients/register
// Handles online patient self-registration
router.post('/register', registerPatient);

module.exports = router;
