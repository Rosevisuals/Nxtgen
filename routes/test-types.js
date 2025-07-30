const express = require('express');
const router = express.Router();
const {
  getAllTestType,
  getTestTypeById,
  createTestType,
  updateTestType,
  deleteTestType
} = require('../controllers/testTypesController');
const { checkSchema } = require('express-validator');

router.get('/', getAllTestType);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getTestTypeById);
router.post('/', checkSchema({
  "Name_of_test": {
    isString: true,
    isLength: { options: { max: 25 } }
  },
}), createTestType);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  Name_of_test: {
    isString: true,
    isLength: { options: { max: 25 } },
    optional: false,
    isEmpty: false
  },
}), updateTestType);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteTestType);

module.exports = router; 