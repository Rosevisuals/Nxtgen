const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const reportsController = require('../controllers/reportsController');

router.get('/', auth, reportsController.getAllReports);
router.get('/:id', auth, reportsController.getReportById);
router.post('/', auth, reportsController.createReport);
router.put('/:id', auth, reportsController.updateReport);
router.delete('/:id', auth, reportsController.deleteReport);

module.exports = router; 