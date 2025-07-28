// routes/billing.js - Billing Routes

const express = require('express');
const router = express.Router();
const {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  generateReceiptPdf
} = require('../controllers/billingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/billing
router.get('/', authenticateToken, getAllBills);

// GET /api/billing/:id
router.get('/:id', authenticateToken, getBillById);

// POST /api/billing
router.post('/', authenticateToken, createBill);

// PUT /api/billing/:id
router.put('/:id', authenticateToken, updateBill);

// DELETE /api/billing/:id
router.delete('/:id', authenticateToken, deleteBill);

// GET /api/billing/:id/receipt/pdf
router.get('/:id/receipt/pdf', authenticateToken, generateReceiptPdf);

module.exports = router;