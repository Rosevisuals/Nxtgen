// routes/appointments.js
const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllAppointments);
router.get('/:id', authenticateToken, getAppointmentById);
router.post('/', authenticateToken, createAppointment);
router.put('/:id/status', authenticateToken, updateAppointmentStatus);

module.exports = router;
