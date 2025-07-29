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

router.get('/', authenticateToken, getAllLabRequests);
router.get('/:id', authenticateToken, checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getLabRequestById);

router.post('/', authenticateToken, checkSchema({
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
    optional: true
  },
  notes: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: true
  },
  results: {
    isString: true,
    isLength: { options: { max: 100 } },
    optional: true
  },
  date_conducted: {
    isISO8601: true,
    optional: false,
    isEmpty: false
  }
}), createLabRequest);

router.put('/:id', authenticateToken, checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  patient_id: {
    isInt: true,
    optional: true
  },
  doctor_id: {
    isInt: true,
    optional: true
  },
  test_id: {
    isInt: true,
    optional: true
  },
  technician_id: {
    isInt: true,
    optional: true
  },
  notes: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: true
  },
  results: {
    isString: true,
    isLength: { options: { max: 100 } },
    optional: true
  },
  date_conducted: {
    isISO8601: true,
    optional: true
  }
}), updateLabRequest);

router.delete('/:id', authenticateToken, checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteLabRequest);

module.exports = router;