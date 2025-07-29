// controllers/departmentController.js - Department Management Controller

const Department = require('../models/departmentModel');

// ===== GET ALL DEPARTMENTS FUNCTION =====
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// ===== GET DEPARTMENT BY ID FUNCTION =====
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error('Error fetching department:', error.message);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

// ===== CREATE DEPARTMENT FUNCTION =====
const createDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }
  try {
    const newDepartment = await Department.create(req.body);
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error.message);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// ===== UPDATE DEPARTMENT FUNCTION =====
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDepartment = await Department.update(id, req.body);
    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error.message);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// ===== DELETE DEPARTMENT FUNCTION =====
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Department.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error.message);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};