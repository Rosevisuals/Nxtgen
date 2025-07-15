const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatsController = require('../controllers/chatsController');

router.get('/', auth, chatsController.getAllChats);
router.get('/:id', auth, chatsController.getChatById);
router.post('/', auth, chatsController.createChat);
router.put('/:id', auth, chatsController.updateChat);
router.delete('/:id', auth, chatsController.deleteChat);

module.exports = router; 