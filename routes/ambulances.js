const express = require('express');
const router = express.Router();
const {
  getAllAmbulances,
  getAmbulanceById,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
  getAllAmbulanceCalls,
  getAmbulanceCallById,
  createAmbulanceCall,
  updateAmbulanceCall,
  deleteAmbulanceCall
} = require('../controllers/ambulanceController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Ambulances
router.get('/', authenticateToken, getAllAmbulances);
router.get('/:id', authenticateToken, getAmbulanceById);
router.post('/', authenticateToken, createAmbulance);
router.put('/:id', authenticateToken, updateAmbulance);
router.delete('/:id', authenticateToken, deleteAmbulance);

// Ambulance Calls
router.get('/calls/all', authenticateToken, getAllAmbulanceCalls);
router.get('/calls/:id', authenticateToken, getAmbulanceCallById);
router.post('/calls', authenticateToken, createAmbulanceCall);
router.put('/calls/:id', authenticateToken, updateAmbulanceCall);
router.delete('/calls/:id', authenticateToken, deleteAmbulanceCall);

module.exports = router; 