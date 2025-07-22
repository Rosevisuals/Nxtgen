// routes/patients.js - Patient Routes
// This file defines the URL endpoints (routes) for patient-related operations
// Think of this as the "directory" that tells visitors where to go for patient services

// Import required packages
const express = require('express');        // Express framework for creating routes
const router = express.Router();           // Create a new router for patient routes

// Import the controller functions that handle the actual business logic
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientsController');

// Import the authentication middleware
const { authenticateToken } = require('../middleware/authMiddleware');

// ===== ROUTE DEFINITIONS =====
// Each route defines a URL path and what should happen when someone visits that URL
// The middleware runs before the controller function to check if the user is logged in

// GET /api/patients
// This route is for getting a list of all patients
// Example: When someone visits http://localhost:5000/api/patients
router.get('/', authenticateToken, getAllPatients);
// - authenticateToken: First check if the user is logged in
// - getAllPatients: If logged in, run this function to get all patients

// GET /api/patients/:id
// This route is for getting information about a specific patient
// Example: When someone visits http://localhost:5000/api/patients/1
// The :id part is a parameter - it can be any number (1, 2, 3, etc.)
router.get('/:id', authenticateToken, getPatientById);
// - authenticateToken: First check if the user is logged in
// - getPatientById: If logged in, run this function to get the specific patient

// POST /api/patients
// This route is for creating a new patient
// Example: When someone sends a POST request to http://localhost:5000/api/patients
// with patient data in the request body
router.post('/', authenticateToken, createPatient);
// - authenticateToken: First check if the user is logged in
// - createPatient: If logged in, run this function to create a new patient

// PUT /api/patients/:id
// This route is for updating an existing patient's information
router.put('/:id', authenticateToken, updatePatient);

// DELETE /api/patients/:id
// This route is for deleting a patient
router.delete('/:id', authenticateToken, deletePatient);

// ===== HOW ROUTES WORK =====
// 1. Someone makes a request to a URL (like /api/patients)
// 2. Express checks if there's a route that matches that URL
// 3. If found, it runs the middleware first (authenticateToken)
// 4. If middleware passes, it runs the controller function (getAllPatients, etc.)
// 5. The controller function sends back a response (patient data, error message, etc.)

// Export the router so it can be used in the main server.js file
module.exports = router;
