// routes/pharmacy.js
const express = require('express');
const router = express.Router();
const {
  getPendingPrescriptions,
  dispenseMedication
} = require('../controllers/pharmacyController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/pending', authenticateToken, getPendingPrescriptions);
router.post('/dispense', authenticateToken, dispenseMedication);

module.exports = router;
