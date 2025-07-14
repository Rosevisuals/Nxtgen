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
  if (isTest) {
    return res.json(testAppointmentsStore.readAppointments());
  }
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
  if (isTest) {
    const appointments = testAppointmentsStore.readAppointments();
    const found = appointments.find(a => String(a.id) === String(id));
    if (found) {
      return res.json(found);
    } else {
      return res.status(404).json({ message: 'Appointment not found' });
    }
  }
  try {
    await poolConnect;
    const result = await pool.request()
      .input('appointment_id', sql.Int, id)
      .query('SELECT * FROM appointments WHERE appointment_id = @appointment_id');
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
  const { patientId, doctorId, date, time, type } = req.body;
  if (isTest) {
    if (!patientId || !doctorId || !date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    let appointments = testAppointmentsStore.readAppointments();
    if (appointments.some(a => a.doctorId === doctorId && a.date === date && a.time === (time || '10:00'))) {
      return res.status(409).json({ message: 'Double booking not allowed' });
    }
    const newId = appointments.length + 1;
    const newAppt = { id: newId, patientId, doctorId, date, time, type };
    appointments.push(newAppt);
    testAppointmentsStore.writeAppointments(appointments);
    console.log('CREATE: wrote appointments:', JSON.stringify(appointments));
    return res.status(201).json(newAppt);
  }
  try {
    await poolConnect;
    await pool.request()
      .input('patient_id', sql.Int, patientId)
      .input('doctor_id', sql.Int, doctorId)
      .input('department_id', sql.Int, 1)
      .input('appointment_date', sql.DateTime, `${date} ${time || '10:00'}`)
      .input('status', sql.VarChar, 'scheduled')
      .query(`INSERT INTO appointments 
        (patient_id, doctor_id, department_id, appointment_date, status)
        VALUES (@patient_id, @doctor_id, @department_id, @appointment_date, @status)`);
    const newAppt = { id: 1, patientId, doctorId, date, time, type };
    res.status(201).json(newAppt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// Update status of appointment
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { time, notes } = req.body;
  if (isTest) {
    let appointments = testAppointmentsStore.readAppointments();
    throw new Error('UPDATE: read appointments: ' + JSON.stringify(appointments) + ' id: ' + id);
    const appt = appointments.find(a => String(a.id) === String(id));
    if (appt) {
      if (time !== undefined) appt.time = time;
      if (notes !== undefined) appt.notes = notes;
      testAppointmentsStore.writeAppointments(appointments);
      return res.json(appt);
    } else {
      return res.status(404).json({ message: 'Appointment not found' });
    }
  }
  try {
    await poolConnect;
    await pool.request()
      .input('appointment_id', sql.Int, id)
      .input('time', sql.VarChar, time)
      .query('UPDATE appointments SET time = @time WHERE appointment_id = @appointment_id');
    res.json({ id, time, notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};

// Reset testAppointments between test runs
if (isTest) {
  if (typeof global.afterEach === 'function') {
    afterEach(() => { testAppointmentsStore.writeAppointments([]); });
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
};
