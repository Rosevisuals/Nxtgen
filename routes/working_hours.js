const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const workingHoursController = require('../controllers/workingHoursController');

router.get('/', auth, workingHoursController.getAllWorkingHours);
router.get('/:id', auth, workingHoursController.getWorkingHourById);
router.post('/', auth, workingHoursController.createWorkingHour);
router.put('/:id', auth, workingHoursController.updateWorkingHour);
router.delete('/:id', auth, workingHoursController.deleteWorkingHour);

module.exports = router; 