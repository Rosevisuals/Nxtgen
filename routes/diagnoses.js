const express = require('express');
const router = express.Router();
const {
  getAllDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis
} = require('../controllers/diagnosesController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllDiagnoses);
router.get('/:id', getDiagnosisById);
router.post('/', createDiagnosis);
router.put('/:id', updateDiagnosis);
router.delete('/:id', deleteDiagnosis);

module.exports = router; 