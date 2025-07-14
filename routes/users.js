// routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser } = require('../controllers/usersController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Only admin can access users module
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllUsers);
router.post('/', authenticateToken, authorizeRoles(['admin']), createUser);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteUser);

module.exports = router;
