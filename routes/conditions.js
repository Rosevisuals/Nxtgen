const express = require('express');
const { checkSchema } = require('express-validator');
const router = express.Router();
const {
  getAllConditions,
  getConditionById,
  createCondition,
  updateCondition,
  deleteCondition
} = require('../controllers/conditionsController');

router.get('/', getAllConditions);
router.get('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), getConditionById);
router.post('/', checkSchema({
  Name: {
    isString: true,
    isLength: { options: { max: 100 } },
    optional: false,
    isEmpty: false
  },
  Description: {
    isString: true,
    optional: true,
    isEmpty: false
  },
  Status: {
    isString: true,
    optional: false,
    isEmpty: false,
    isIn: { options: "permanent,temporary" }
  },
}), createCondition);
router.put('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  },
  Name: {
    isString: true,
    isLength: { options: { max: 100 } },
    optional: false,
    isEmpty: false
  },
  Description: {
    isString: true,
    optional: true,
    isEmpty: false
  },
  Status: {
    isString: true,
    optional: false,
    isEmpty: false,
    isIn: { options: "permanent,temporary" }
  },
}), updateCondition);
router.delete('/:id', checkSchema({
  id: {
    isInt: true,
    optional: false,
    isEmpty: false
  }
}), deleteCondition);

module.exports = router; 