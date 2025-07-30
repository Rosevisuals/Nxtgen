const { validationResult } = require("express-validator");
const staffModel = require("../models/staffModel");

const getAllStaff = async (req, res) => {
  try {
    const result = await staffModel.getAllStaff();
    res.json(result);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

const getStaffById = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    const staff = await staffModel.getStaffById(parseInt(id));
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

const createStaff = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const {
    full_Name,
    email,
    password,
    phone,
    gender,
    DOB,
    marital_status,
    Address,
    status,
    specialization,
    biodata,
    head_department,
    license_number,
    role_id,
    department_id,
    created_at
  } = req.body;
  try {
    const newStaff = await staffModel.createStaff({
      full_Name,
      email,
      password,
      phone,
      gender,
      DOB,
      marital_status,
      Address,
      status,
      specialization,
      biodata,
      head_department,
      license_number,
      role_id,
      department_id,
      created_at: created_at ?? new Date().toISOString()
    });
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error.message);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

const updateStaff = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  const { specialization, biodata, head_department, license_number, role_id, department_id } = req.body;
  try {
    const updatedStaff = await staffModel.updateStaff(parseInt(id), { specialization, biodata, head_department, license_number, role_id, department_id });
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
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    await staffModel.deleteStaff(parseInt(id));
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    console.error('Error deleting staff:', error.message);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
};

module.exports = {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffById,
  updateStaff
}; 