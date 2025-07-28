const express = require('express');
const router = express.Router();
const {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  deleteWard
} = require('../controllers/wardsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkSchema } = require('express-validator');

router.get('/', getAllWards);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getWardById);
router.post('/', checkSchema({
  Department_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  ward_number: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: false,
    isEmpty: false
  },
  ward_type: {
    isString: true,
    optional: false,
    isEmpty: false,
    isLength: { options: { max: 25 } },
    isIn: {
      options: "private,public"
    }
  }
}), createWard);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  Department_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  ward_number: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: false,
    isEmpty: false
  },
  ward_type: {
    isString: true,
    optional: false,
    isEmpty: false,
    isLength: { options: { max: 25 } },
    isIn: {
      options: "private,public"
    }
  }
}), updateWard);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteWard);

module.exports = router; 