// controllers/rolesController.js
const rolesModel = require('../models/rolesModel');

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await rolesModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// Get a single role by ID
const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await rolesModel.getRoleById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Error in getRoleById:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
};