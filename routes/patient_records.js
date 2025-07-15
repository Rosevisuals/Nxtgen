const express = require('express');
const router = express.Router();
const {
  getAllPatientRecords,
  getPatientRecordById,
  createPatientRecord,
  updatePatientRecord,
  deletePatientRecord
} = require('../controllers/patientRecordsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllPatientRecords);
router.get('/:id', authenticateToken, getPatientRecordById);
router.post('/', authenticateToken, createPatientRecord);
router.put('/:id', authenticateToken, updatePatientRecord);
router.delete('/:id', authenticateToken, deletePatientRecord);

module.exports = router; 