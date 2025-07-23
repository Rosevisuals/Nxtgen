const express = require('express');
const router = express.Router();
const {
  getAllBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed
} = require('../controllers/bedsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', getAllBeds);
router.get('/:id', getBedById);
router.post('/', createBed);
router.put('/:id', updateBed);
router.delete('/:id', deleteBed);

module.exports = router; 