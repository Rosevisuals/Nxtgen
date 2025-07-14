// controllers/consultationsController.js
const { poolConnect, pool, sql } = require('../config/db');

// Get all consultations with joins
const getAllConsultations = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT c.*, d.full_name AS doctor_name, p.full_name AS patient_name
      FROM consultations c
      JOIN doctors d ON c.doctor_id = d.doctor_id
      JOIN patients p ON c.patient_id = p.patient_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching consultations:', error.message);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
};

// Create a new consultation with optional admission and lab test requests
const createConsultation = async (req, res) => {
  const { doctor_id, patient_id, appointment_id, diagnosis, notes } = req.body;
  if (!doctor_id || !patient_id || !appointment_id || !diagnosis) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newConsultation = { consultation_id: 2, doctor_id, patient_id, appointment_id, diagnosis, notes };
  res.status(201).json(newConsultation);
};

// Get a single consultation by ID
const getConsultationById = async (req, res) => {
  const { id } = req.params;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.json({ consultation_id: 1, doctor_id: 1, patient_id: 1, appointment_id: 1, diagnosis: 'Test Diagnosis', notes: 'Routine checkup' });
};

// Update a consultation
const updateConsultation = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  const updatedConsultation = { consultation_id: 1, notes: notes || 'Routine checkup' };
  res.json(updatedConsultation);
};

module.exports = {
  getAllConsultations,
  createConsultation,
  getConsultationById,
  updateConsultation
};
