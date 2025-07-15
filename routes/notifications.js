const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const notificationsController = require('../controllers/notificationsController');

router.get('/', auth, notificationsController.getAllNotifications);
router.get('/:id', auth, notificationsController.getNotificationById);
router.post('/', auth, notificationsController.createNotification);
router.put('/:id', auth, notificationsController.updateNotification);
router.delete('/:id', auth, notificationsController.deleteNotification);

module.exports = router; 