// routes/finance.js
const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction,
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  getAllBillItems,
  getBillItemsByBillId
} = require('../controllers/financeController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllTransactions);
router.post('/', authenticateToken, createTransaction);
router.get('/bills', authenticateToken, getAllBills);
router.get('/bills/:id', authenticateToken, getBillById);
router.post('/bills', authenticateToken, createBill);
router.put('/bills/:id', authenticateToken, updateBill);
router.delete('/bills/:id', authenticateToken, deleteBill);
router.get('/bill-items', authenticateToken, getAllBillItems);
router.get('/bill-items/:bill_id', authenticateToken, getBillItemsByBillId);

module.exports = router;
