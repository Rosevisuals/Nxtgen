const { poolConnect, pool, sql } = require('../config/db');

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT s.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
      FROM staff s
      JOIN users u ON s.user_id = u.user_id
      JOIN departments dept ON s.department_id = dept.department_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

// Get a single staff member by ID
const getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('staff_id', sql.Int, id)
      .query(`SELECT s.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
              FROM staff s
              JOIN users u ON s.user_id = u.user_id
              JOIN departments dept ON s.department_id = dept.department_id
              WHERE s.staff_id = @staff_id`);
    const staff = result.recordset[0];
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
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
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('designation', sql.VarChar, designation)
      .input('department_id', sql.Int, department_id)
      .input('salary', sql.Decimal(10, 2), salary)
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO staff (user_id, designation, department_id, salary, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @designation, @department_id, @salary, @created_at)`);
    const newStaff = insertResult.recordset[0];
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error.message);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

// Update a staff member
const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { designation, department_id, salary } = req.body;
  try {
    await poolConnect;
    // Only update provided fields
    const fields = [];
    if (designation) fields.push('designation = @designation');
    if (department_id) fields.push('department_id = @department_id');
    if (salary != null) fields.push('salary = @salary');
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE staff SET ${fields.join(', ')} WHERE staff_id = @staff_id`;
    const request = pool.request().input('staff_id', sql.Int, id);
    if (designation) request.input('designation', sql.VarChar, designation);
    if (department_id) request.input('department_id', sql.Int, department_id);
    if (salary != null) request.input('salary', sql.Decimal(10, 2), salary);
    await request.query(updateQuery);
    // Return the updated staff member
    const result = await pool.request()
      .input('staff_id', sql.Int, id)
      .query(`SELECT s.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
              FROM staff s
              JOIN users u ON s.user_id = u.user_id
              JOIN departments dept ON s.department_id = dept.department_id
              WHERE s.staff_id = @staff_id`);
    const updatedStaff = result.recordset[0];
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error.message);
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

// Delete a staff member
const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('staff_id', sql.Int, id)
      .query('DELETE FROM staff WHERE staff_id = @staff_id');
    res.json({ message: 'Staff deleted' });
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