const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const roomsController = require('../controllers/roomsController');

// Rooms
router.get('/', auth, roomsController.getAllRooms);
router.get('/:id', auth, roomsController.getRoomById);
router.post('/', auth, roomsController.createRoom);
router.put('/:id', auth, roomsController.updateRoom);
router.delete('/:id', auth, roomsController.deleteRoom);

// Room Allotments
router.get('/allotments', auth, roomsController.getAllRoomAllotments);
router.get('/allotments/:id', auth, roomsController.getRoomAllotmentById);
router.post('/allotments', auth, roomsController.createRoomAllotment);
router.put('/allotments/:id', auth, roomsController.updateRoomAllotment);
router.delete('/allotments/:id', auth, roomsController.deleteRoomAllotment);

module.exports = router; 