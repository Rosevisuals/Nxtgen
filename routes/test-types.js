const express = require('express');
const router = express.Router();
const {
  getAllTestType,
  getTestTypeById,
  createTestType,
  updateTestType,
  deleteTestType
} = require('../controllers/TestTypesController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllTestType);
router.get('/:id', getTestTypeById);
router.post('/', createTestType);
router.put('/:id', updateTestType);
router.delete('/:id', deleteTestType);

module.exports = router; 