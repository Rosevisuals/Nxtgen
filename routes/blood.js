const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const bloodController = require('../controllers/bloodController');

// Blood Donors
router.get('/donors', auth, bloodController.getAllBloodDonors);
router.get('/donors/:id', auth, bloodController.getBloodDonorById);
router.post('/donors', auth, bloodController.createBloodDonor);
router.put('/donors/:id', auth, bloodController.updateBloodDonor);
router.delete('/donors/:id', auth, bloodController.deleteBloodDonor);

// Blood Stock
router.get('/stock', auth, bloodController.getAllBloodStock);
router.get('/stock/:id', auth, bloodController.getBloodStockById);
router.post('/stock', auth, bloodController.createBloodStock);
router.put('/stock/:id', auth, bloodController.updateBloodStock);
router.delete('/stock/:id', auth, bloodController.deleteBloodStock);

// Blood Issued
router.get('/issued', auth, bloodController.getAllBloodIssued);
router.get('/issued/:id', auth, bloodController.getBloodIssuedById);
router.post('/issued', auth, bloodController.createBloodIssued);
router.put('/issued/:id', auth, bloodController.updateBloodIssued);
router.delete('/issued/:id', auth, bloodController.deleteBloodIssued);

module.exports = router; 