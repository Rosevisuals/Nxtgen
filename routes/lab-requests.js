const express = require('express');
const { checkSchema } = require('express-validator');
const router = express.Router();
const {
  getAllLabRequests,
  getLabRequestById,
  createLabRequest,
  updateLabRequest,
  deleteLabRequest
} = require('../controllers/labRequestsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllLabRequests);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getLabRequestById);
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
  test_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  technician_id: {
    isInt: true,
    optional: true,
    isEmpty: false
  },
  specialization: {
    isString: true,
    isLength: { options: { max: 30 } },
    optional: true,
    isEmpty: false
  },
  biodata: {
    isString: true,
    isLength: { options: { max: 20 } },
    optional: true,
    isEmpty: false
  },
  notes: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: true,
    isEmpty: false
  },
  results: {
    isString: true,
    isLength: { options: { max: 100 } },
    optional: true,
    isEmpty: false
  },
  date_conducted: {
    isDate: true,
    optional: false,
    isEmpty: false
  }
}), createLabRequest);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
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
  test_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  technician_id: {
    isInt: true,
    optional: true,
    isEmpty: false
  },
  specialization: {
    isString: true,
    isLength: { options: { max: 30 } },
    optional: true,
    isEmpty: false
  },
  biodata: {
    isString: true,
    isLength: { options: { max: 20 } },
    optional: true,
    isEmpty: false
  },
  notes: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: true,
    isEmpty: false
  },
  results: {
    isString: true,
    isLength: { options: { max: 100 } },
    optional: true,
    isEmpty: false
  },
  date_conducted: {
    isDate: true,
    optional: false,
    isEmpty: false
  }
}), updateLabRequest);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteLabRequest);

module.exports = router; 