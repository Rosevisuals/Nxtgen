const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllDoctors);
router.get('/:id', authenticateToken, getDoctorById);
router.post('/', authenticateToken, createDoctor);
router.put('/:id', authenticateToken, updateDoctor);
router.delete('/:id', authenticateToken, deleteDoctor);

module.exports = router; 