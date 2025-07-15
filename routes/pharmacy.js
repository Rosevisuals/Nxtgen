// routes/pharmacy.js
const express = require('express');
const router = express.Router();
const {
  getPendingPrescriptions,
  dispenseMedication,
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getAllPrescriptionItems,
  getPrescriptionItemsByPrescriptionId
} = require('../controllers/pharmacyController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/pending', authenticateToken, getPendingPrescriptions);
router.post('/dispense', authenticateToken, dispenseMedication);
router.get('/prescriptions', authenticateToken, getAllPrescriptions);
router.get('/prescriptions/:id', authenticateToken, getPrescriptionById);
router.post('/prescriptions', authenticateToken, createPrescription);
router.put('/prescriptions/:id', authenticateToken, updatePrescription);
router.delete('/prescriptions/:id', authenticateToken, deletePrescription);
router.get('/prescription-items', authenticateToken, getAllPrescriptionItems);
router.get('/prescription-items/:prescription_id', authenticateToken, getPrescriptionItemsByPrescriptionId);

module.exports = router;
