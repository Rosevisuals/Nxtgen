const express = require('express');
const { checkSchema } = require('express-validator');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllStaff);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getStaffById);
router.post('/', checkSchema({
  user_id: {
    isInt: true,
    optional: false,
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
  head_department: {
    isString: true,
    isLength: { options: { max: 15 } },
    isIn: {
      options: "false,true",
      optional: true,
      isEmpty: false
    }
  },
  license_number: {
    isString: true,
    isLength: { options: { max: 20 } },
    optional: true,
    isEmpty: false
  },
  role_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  department_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  created_at: {
    isDate: true,
    optional: true,
    isEmpty: false
  }
}), createStaff);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  user_id: {
    isInt: true,
    optional: false,
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
  head_department: {
    isString: true,
    isLength: { options: { max: 15 } },
    isIn: {
      options: "false,true",
      optional: true,
      isEmpty: false
    }
  },
  license_number: {
    isString: true,
    isLength: { options: { max: 20 } },
    optional: true,
    isEmpty: false
  },
  role_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  department_id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  created_at: {
    isDate: true,
    optional: true,
    isEmpty: false
  }
}), updateStaff);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteStaff);

module.exports = router; 