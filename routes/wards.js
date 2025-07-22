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

router.get('/', getAllWards);
router.get('/:id', getWardById);
router.post('/', createWard);
router.put('/:id', updateWard);
router.delete('/:id', deleteWard);

module.exports = router; 