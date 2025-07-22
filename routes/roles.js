// routes/roles.js
const express = require('express');
const router = express.Router();
const { getAllRoles, getRoleById } = require('../controllers/rolesController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Admin-only routes for roles
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllRoles);
router.get('/:id', authenticateToken, authorizeRoles(['admin']), getRoleById);

module.exports = router;