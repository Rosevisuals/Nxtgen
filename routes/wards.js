// routes/ward.js
const express = require('express');
const router = express.Router();

const {
  getAllWards,
  addWard,
  getBedsInWard,
  addBed,
  assignBedToPatient,
  dischargePatientFromBed
} = require('../controllers/wardController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllWards);
router.post('/add', authenticateToken, addWard);
router.get('/:ward_id/beds', authenticateToken, getBedsInWard);
router.post('/bed/add', authenticateToken, addBed);
router.post('/bed/assign', authenticateToken, assignBedToPatient);
router.post('/bed/discharge', authenticateToken, dischargePatientFromBed);

module.exports = router;
