const express = require('express');
const { checkSchema } = require('express-validator');
const router = express.Router();
const {
  getAllBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed
} = require('../controllers/bedsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllBeds);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getBedById);
router.post('/',
  checkSchema({
    patient_id: {
      isInt: true,
      optional: true,
      isEmpty: false
    },
    bed_number: {
      isInt: true,
      optional: false,
      isEmpty: false
    },
    status: {
      isString: true,
      optional: false,
      isEmpty: false,
      isIn: { options: "Available,unavailable" }
    },
    ward_id: {
      isInt: true,
      optional: false,
      isEmpty: false
    }
  }), createBed);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  patient_id: {
    isInt: true,
    optional: true,
    isEmpty: false
  },
  bed_number: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  status: {
    isString: true,
    optional: false,
    isEmpty: false,
    isIn: { options: "unavailable,Available" }
  },
  ward_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), updateBed);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteBed);

module.exports = router; 