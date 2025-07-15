const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const emailsController = require('../controllers/emailsController');

router.get('/', auth, emailsController.getAllEmails);
router.get('/:id', auth, emailsController.getEmailById);
router.post('/', auth, emailsController.createEmail);
router.put('/:id', auth, emailsController.updateEmail);
router.delete('/:id', auth, emailsController.deleteEmail);

module.exports = router; 