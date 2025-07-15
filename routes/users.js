// routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser, getAllRoles } = require('../controllers/usersController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Only admin can access users module
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllUsers);
router.post('/', authenticateToken, authorizeRoles(['admin']), createUser);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteUser);
// Add a route to fetch all roles
router.get('/roles', authenticateToken, authorizeRoles(['admin']), getAllRoles);

module.exports = router;
