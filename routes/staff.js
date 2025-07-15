const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllStaff);
router.get('/:id', authenticateToken, getStaffById);
router.post('/', authenticateToken, createStaff);
router.put('/:id', authenticateToken, updateStaff);
router.delete('/:id', authenticateToken, deleteStaff);

module.exports = router; 