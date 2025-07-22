const { poolConnect, pool, sql } = require('../config/db');

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

const createStaff = async (req, res) => {
  const {
    user_id,
    specialization,
    biodata,
    head_department,
    license_number,
    role_id,
    department_id,
    created_at
  } = req.body;
  if (!user_id || !role_id || !license_number) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('specialization', sql.VarChar(30), specialization)
      .input('biodata', sql.VarChar(20), biodata)
      .input('head_department', sql.VarChar(15), head_department)
      .input('license_number', sql.VarChar(20), license_number)
      .input('role_id', sql.Int, role_id)
      .input('department_id', sql.Int, department_id)
      .input('created_at', sql.DateTime, created_at ?? now)
      .query(`INSERT INTO staff (
        user_id, 
        specialization, 
        biodata, 
        head_department, 
        license_number, 
        role_id,
        department_id,
        created_at)
        OUTPUT INSERTED.* VALUES (
        @user_id, 
        @specialization, 
        @biodata, 
        @head_department, 
        @license_number, 
        @role_id, 
        @department_id, 
        @created_at)`);
    const newStaff = insertResult.recordset[0];
    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error.message);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { specialization, biodata, head_department, license_number, role_id, department_id } = req.body;
  try {
    await poolConnect;
    // Only update provided fields
    const fields = [];

    if (specialization) fields.push('specialization = @specialization');
    if (biodata) fields.push('biodata = @biodata');
    if (head_department) fields.push('head_department = @head_department');
    if (license_number) fields.push('license_number = @license_number');
    if (role_id) fields.push('role_id = @role_id');
    if (department_id) fields.push('department_id = @department_id');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE staff SET ${fields.join(', ')} WHERE staff_id = @staff_id`;

    const request = pool.request().input('staff_id', sql.Int, id);
    if (specialization) request.input('specialization', sql.VarChar(30), specialization);
    if (biodata) request.input('biodata', sql.VarChar(20), biodata)
    if (head_department) request.input('head_department', sql.VarChar(15), head_department)
    if (license_number) request.input('license_number', sql.VarChar(20), license_number)
    if (role_id) request.input('role_id', sql.Int, role_id)
    if (department_id) request.input('department_id', sql.Int, department_id)
    await request.query(updateQuery);

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