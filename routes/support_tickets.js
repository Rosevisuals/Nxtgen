const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const supportTicketsController = require('../controllers/supportTicketsController');

router.get('/', auth, supportTicketsController.getAllSupportTickets);
router.get('/:id', auth, supportTicketsController.getSupportTicketById);
router.post('/', auth, supportTicketsController.createSupportTicket);
router.put('/:id', auth, supportTicketsController.updateSupportTicket);
router.delete('/:id', auth, supportTicketsController.deleteSupportTicket);

module.exports = router; 