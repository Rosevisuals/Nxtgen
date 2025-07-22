const express = require('express');
const router = express.Router();
const {
  getAllLabRequests,
  getLabRequestById,
  createLabRequest,
  updateLabRequest,
  deleteLabRequest
} = require('../controllers/labRequestsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllLabRequests);
router.get('/:id', getLabRequestById);
router.post('/', createLabRequest);
router.put('/:id', updateLabRequest);
router.delete('/:id', deleteLabRequest);

module.exports = router; 