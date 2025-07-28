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
const { checkSchema } = require('express-validator');

router.get('/', getAllDiagnoses);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getDiagnosisById);
router.post('/', checkSchema({
  patient_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  doctor_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  ConditionID: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  Symptoms: {
    isString: true,
    optional: true,
    isEmpty: false
  },
  DiagnosisNote: {
    isString: true,
    optional: true,
    isEmpty: false
  },
  DiagnosisDate: {
    isDate: true,
    optional: false,
    isEmpty: false
  },
  requestdate: {
    isDate: true,
    optional: false,
    isEmpty: false
  }
}), createDiagnosis);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    isEmpty: false
  },
  patient_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  doctor_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  ConditionID: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  Symptoms: {
    isString: true,
    optional: true,
    isEmpty: false
  },
  DiagnosisNote: {
    isString: true,
    optional: true,
    isEmpty: false
  },
  DiagnosisDate: {
    isDate: true,
    optional: false,
    isEmpty: false
  },
  requestdate: {
    isDate: true,
    optional: false,
    isEmpty: false
  }
}), updateDiagnosis);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteDiagnosis);

module.exports = router; 