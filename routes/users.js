// routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser, getUserById, updateUser } = require('../controllers/usersController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Only admin can access users module
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllUsers);
router.post('/', authenticateToken, authorizeRoles(['admin']), createUser);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteUser);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), getUserById);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), updateUser);

module.exports = router;
