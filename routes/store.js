// routes/store.js
const express = require('express');
const router = express.Router();

const {
  getAllItems,
  addItem,
  updateStock
} = require('../controllers/storeController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllItems);
router.post('/add', authenticateToken, addItem);
router.put('/update', authenticateToken, updateStock);

module.exports = router;
