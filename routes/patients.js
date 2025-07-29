// routes/patients.js - Patient Management Routes

const express = require('express');
const router = express.Router();

const { 
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  registerPatient 
} = require('../controllers/patientsController');

// GET /api/patients
// Get all patients
router.get('/', getAllPatients);

// GET /api/patients/:id
// Get patient by ID
router.get('/:id', getPatientById);

// POST /api/patients/create
// Staff creates patient (in-person registration)
router.post('/create', createPatient);

// POST /api/patients/register
// Patient self-registration (online)
router.post('/register', registerPatient);

// PUT /api/patients/:id
// Update patient information
router.put('/:id', updatePatient);

// DELETE /api/patients/:id
// Delete patient
router.delete('/:id', deletePatient);

module.exports = router;
