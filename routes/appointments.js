// routes/appointments.js - Appointment Routes
// This file defines the URL endpoints for appointment-related operations.

const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentsController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/appointments
router.get('/', authenticateToken, getAllAppointments);

// GET /api/appointments/:id
router.get('/:id', authenticateToken, getAppointmentById);

// POST /api/appointments
router.post('/', authenticateToken, createAppointment);

// PUT /api/appointments/:id
router.put('/:id', authenticateToken, updateAppointment);

// DELETE /api/appointments/:id
router.delete('/:id', authenticateToken, deleteAppointment);

module.exports = router;
