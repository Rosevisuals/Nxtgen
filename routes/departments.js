// routes/departments.js - Department Routes

const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/departments
router.get('/', authenticateToken, getAllDepartments);

// GET /api/departments/:id
router.get('/:id', authenticateToken, getDepartmentById);

// POST /api/departments
router.post('/', authenticateToken, createDepartment);

// PUT /api/departments/:id
router.put('/:id', authenticateToken, updateDepartment);

// DELETE /api/departments/:id
router.delete('/:id', authenticateToken, deleteDepartment);

module.exports = router;