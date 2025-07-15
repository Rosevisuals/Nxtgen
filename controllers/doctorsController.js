const { poolConnect, pool, sql } = require('../config/db');

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT d.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
      FROM doctors d
      JOIN users u ON d.user_id = u.user_id
      JOIN departments dept ON d.department_id = dept.department_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('doctor_id', sql.Int, id)
      .query(`SELECT d.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
              FROM doctors d
              JOIN users u ON d.user_id = u.user_id
              JOIN departments dept ON d.department_id = dept.department_id
              WHERE d.doctor_id = @doctor_id`);
    const doctor = result.recordset[0];
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error.message);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// Create a new doctor
const createDoctor = async (req, res) => {
  const { user_id, specialization, license_number, department_id, availability_status, bio } = req.body;
  if (!user_id || !specialization || !license_number || !department_id) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('specialization', sql.VarChar, specialization)
      .input('license_number', sql.VarChar, license_number)
      .input('department_id', sql.Int, department_id)
      .input('availability_status', sql.VarChar, availability_status || 'available')
      .input('bio', sql.Text, bio || null)
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO doctors (user_id, specialization, license_number, department_id, availability_status, bio, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @specialization, @license_number, @department_id, @availability_status, @bio, @created_at)`);
    const newDoctor = insertResult.recordset[0];
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Error creating doctor:', error.message);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { specialization, license_number, department_id, availability_status, bio } = req.body;
  try {
    await poolConnect;
    // Only update provided fields
    const fields = [];
    if (specialization) fields.push('specialization = @specialization');
    if (license_number) fields.push('license_number = @license_number');
    if (department_id) fields.push('department_id = @department_id');
    if (availability_status) fields.push('availability_status = @availability_status');
    if (bio) fields.push('bio = @bio');
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE doctors SET ${fields.join(', ')} WHERE doctor_id = @doctor_id`;
    const request = pool.request().input('doctor_id', sql.Int, id);
    if (specialization) request.input('specialization', sql.VarChar, specialization);
    if (license_number) request.input('license_number', sql.VarChar, license_number);
    if (department_id) request.input('department_id', sql.Int, department_id);
    if (availability_status) request.input('availability_status', sql.VarChar, availability_status);
    if (bio) request.input('bio', sql.Text, bio);
    await request.query(updateQuery);
    // Return the updated doctor
    const result = await pool.request()
      .input('doctor_id', sql.Int, id)
      .query(`SELECT d.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
              FROM doctors d
              JOIN users u ON d.user_id = u.user_id
              JOIN departments dept ON d.department_id = dept.department_id
              WHERE d.doctor_id = @doctor_id`);
    const updatedDoctor = result.recordset[0];
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error.message);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('doctor_id', sql.Int, id)
      .query('DELETE FROM doctors WHERE doctor_id = @doctor_id');
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Error deleting doctor:', error.message);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
}; 