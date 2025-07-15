// controllers/appointmentsController.js
const { poolConnect, pool, sql } = require('../config/db');

const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
let testAppointmentsStore;
if (isTest) {
  testAppointmentsStore = require('../tests/helpers/testAppointmentsStore');
}

console.log('APPOINTMENTS CONTROLLER LOADED', 'isTest:', isTest);

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT a.*, p.full_name AS patient_name, d.full_name AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('appointment_id', sql.Int, id)
      .query(`SELECT a.*, p.full_name AS patient_name, d.full_name AS doctor_name
              FROM appointments a
              JOIN patients p ON a.patient_id = p.patient_id
              JOIN doctors d ON a.doctor_id = d.doctor_id
              WHERE a.appointment_id = @appointment_id`);
    const appointment = result.recordset[0];
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

// Create new appointment
const createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, status, notes } = req.body;
  if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .input('doctor_id', sql.Int, doctor_id)
      .input('appointment_date', sql.Date, appointment_date)
      .input('appointment_time', sql.Time, appointment_time)
      .input('status', sql.VarChar, status || 'scheduled')
      .input('notes', sql.Text, notes || null)
      .query(`INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, notes)
        OUTPUT INSERTED.*
        VALUES (@patient_id, @doctor_id, @appointment_date, @appointment_time, @status, @notes)`);
    const newAppt = insertResult.recordset[0];
    res.status(201).json(newAppt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// Update status, time, or notes of appointment
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { appointment_time, status, notes } = req.body;
  try {
    await poolConnect;
    // Only update provided fields
    const fields = [];
    if (appointment_time) fields.push('appointment_time = @appointment_time');
    if (status) fields.push('status = @status');
    if (notes) fields.push('notes = @notes');
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE appointments SET ${fields.join(', ')} WHERE appointment_id = @appointment_id`;
    const request = pool.request().input('appointment_id', sql.Int, id);
    if (appointment_time) request.input('appointment_time', sql.Time, appointment_time);
    if (status) request.input('status', sql.VarChar, status);
    if (notes) request.input('notes', sql.Text, notes);
    await request.query(updateQuery);
    // Return the updated appointment
    const result = await pool.request()
      .input('appointment_id', sql.Int, id)
      .query(`SELECT a.*, p.full_name AS patient_name, d.full_name AS doctor_name
              FROM appointments a
              JOIN patients p ON a.patient_id = p.patient_id
              JOIN doctors d ON a.doctor_id = d.doctor_id
              WHERE a.appointment_id = @appointment_id`);
    const updatedAppt = result.recordset[0];
    if (!updatedAppt) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(updatedAppt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
};
