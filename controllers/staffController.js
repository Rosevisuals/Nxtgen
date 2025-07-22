// controllers/staffController.js
const staffModel = require('../models/staffModel');

const getAllStaff = async (req, res) => {
  try {
    const staff = await staffModel.getAllStaff();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

const getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await staffModel.getStaffById(id);
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staffMember);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

const createStaff = async (req, res) => {
  const { user_id, specialization, biodata, head_department, license_number, role_id, department_id } = req.body;
  if (!user_id || !specialization || !license_number || !role_id || !department_id) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }
  try {
    const now = new Date();
    const newStaff = await staffModel.createStaff({
      user_id,
      specialization,
      biodata,
      head_department: head_department || 'false',
      license_number,
      role_id,
      department_id,
      created_at: now,
    });
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error.message);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

const updateStaff = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedStaff = await staffModel.updateStaff(id, updates);
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error.message);
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    await staffModel.deleteStaff(id);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error.message);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};