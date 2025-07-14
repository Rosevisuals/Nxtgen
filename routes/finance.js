// routes/finance.js
const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction
} = require('../controllers/financeController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllTransactions);
router.post('/', authenticateToken, createTransaction);

module.exports = router;
