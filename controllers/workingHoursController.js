const { poolConnect, pool, sql } = require('../config/db');

// ===== WORKING HOURS CRUD =====
const getAllWorkingHours = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT w.*, u.full_name AS user_name, u.email
      FROM working_hours w
      JOIN users u ON w.user_id = u.user_id
      ORDER BY w.user_id, w.day_of_week
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching working hours:', error.message);
    res.status(500).json({ error: 'Failed to fetch working hours' });
  }
};

const getWorkingHourById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('working_hour_id', sql.Int, id)
      .query('SELECT * FROM working_hours WHERE working_hour_id = @working_hour_id');
    const workingHour = result.recordset[0];
    if (!workingHour) return res.status(404).json({ message: 'Working hour not found' });
    res.json(workingHour);
  } catch (error) {
    console.error('Error fetching working hour:', error.message);
    res.status(500).json({ error: 'Failed to fetch working hour' });
  }
};

const createWorkingHour = async (req, res) => {
  const { user_id, day_of_week, start_time, end_time, status } = req.body;
  if (!user_id || !day_of_week || !start_time || !end_time) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('day_of_week', sql.VarChar, day_of_week)
      .input('start_time', sql.Time, start_time)
      .input('end_time', sql.Time, end_time)
      .input('status', sql.VarChar, status || 'active')
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO working_hours (user_id, day_of_week, start_time, end_time, status, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @day_of_week, @start_time, @end_time, @status, @created_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating working hour:', error.message);
    res.status(500).json({ error: 'Failed to create working hour' });
  }
};

const updateWorkingHour = async (req, res) => {
  const { id } = req.params;
  const { day_of_week, start_time, end_time, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (day_of_week) fields.push('day_of_week = @day_of_week');
    if (start_time) fields.push('start_time = @start_time');
    if (end_time) fields.push('end_time = @end_time');
    if (status) fields.push('status = @status');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE working_hours SET ${fields.join(', ')} WHERE working_hour_id = @working_hour_id`;
    const request = pool.request().input('working_hour_id', sql.Int, id);
    if (day_of_week) request.input('day_of_week', sql.VarChar, day_of_week);
    if (start_time) request.input('start_time', sql.Time, start_time);
    if (end_time) request.input('end_time', sql.Time, end_time);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request().input('working_hour_id', sql.Int, id).query('SELECT * FROM working_hours WHERE working_hour_id = @working_hour_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Working hour not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating working hour:', error.message);
    res.status(500).json({ error: 'Failed to update working hour' });
  }
};

const deleteWorkingHour = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('working_hour_id', sql.Int, id).query('DELETE FROM working_hours WHERE working_hour_id = @working_hour_id');
    res.json({ message: 'Working hour deleted' });
  } catch (error) {
    console.error('Error deleting working hour:', error.message);
    res.status(500).json({ error: 'Failed to delete working hour' });
  }
};

module.exports = {
  getAllWorkingHours,
  getWorkingHourById,
  createWorkingHour,
  updateWorkingHour,
  deleteWorkingHour
}; 