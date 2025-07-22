// routes/prescriptions.js - Prescriptions Routes

const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionsController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/prescriptions
router.get('/', authenticateToken, getAllPrescriptions);

// GET /api/prescriptions/:id
router.get('/:id', authenticateToken, getPrescriptionById);

// POST /api/prescriptions
router.post('/', authenticateToken, createPrescription);

// PUT /api/prescriptions/:id
router.put('/:id', authenticateToken, updatePrescription);

// DELETE /api/prescriptions/:id
router.delete('/:id', authenticateToken, deletePrescription);

module.exports = router;