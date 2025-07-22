const express = require('express');
const router = express.Router();
const {
  getAllConditions,
  getConditionById,
  createCondition,
  updateCondition,
  deleteCondition
} = require('../controllers/conditionsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllConditions);
router.get('/:id', getConditionById);
router.post('/', createCondition);
router.put('/:id', updateCondition);
router.delete('/:id', deleteCondition);

module.exports = router; 