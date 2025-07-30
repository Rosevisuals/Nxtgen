const express = require('express');
const router = express.Router();
const {
  getAllDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
  getDiagnosesByPatient,
  getDiagnosesByDoctor,
  getDiagnosesByCondition
} = require('../controllers/diagnosesController');
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
    optional: true,
    isEmpty: false
  },
  requestdate: {
    isDate: true,
    optional: true,
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

// Get diagnoses by patient ID
router.get('/patient/:patient_id', getDiagnosesByPatient);

// Get diagnoses by doctor/staff ID  
router.get('/doctor/:doctor_id', getDiagnosesByDoctor);

// Get diagnoses by condition ID
router.get('/condition/:condition_id', getDiagnosesByCondition);

module.exports = router;
