const staffModel = require("../models/staffModel");

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    // return res.json(await staffModel.getAllStaff());
    return res.status(200).json([{}]);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// Get a single staff member by ID
const getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await staffModel.getStaffById(parseInt(id));
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    else return res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// Create a new staff member
const createStaff = async (req, res) => {
  const { user_id, designation, department_id, salary } = req.body;
  if (!user_id || !designation || !department_id || salary == null) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const newStaff = await staffModel.createStaff({ user_id, designation, department_id, salary });
    return res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error.message);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

// Update a staff member
const updateStaff = async (req, res) => {
  const { id } = req.params;
  const {
    user_id,
    specialization,
    biodata,
    head_department,
    license_number,
    role_id,
    department_id } = req.body;
  try {
    const updatedStaff = await staffModel.updateStaff(parseInt(id), {
      user_id,
      specialization,
      biodata,
      head_department,
      license_number,
      role_id,
      department_id
    });
    if (!updatedStaff) return res.status(404).json({ message: 'Staff not found' });
    else return res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error.message);
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    if (await staffModel.deleteStaff(id)) return res.json({ message: 'Staff deleted' });
    else return res.json({ message: 'Failed to delete staff' });
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
  deleteStaff
}; 