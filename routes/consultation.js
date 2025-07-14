// routes/consultations.js
const express = require('express');
const router = express.Router();
const {
  getAllConsultations,
  createConsultation
} = require('../controllers/consultationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllConsultations);
router.post('/', authenticateToken, createConsultation);

module.exports = router;
