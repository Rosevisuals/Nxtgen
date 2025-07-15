const { poolConnect, pool, sql } = require('../config/db');

// Get all patient records
const getAllPatientRecords = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT r.*, p.full_name AS patient_name
      FROM patient_records r
      JOIN patients p ON r.patient_id = p.patient_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching patient records:', error.message);
    res.status(500).json({ error: 'Failed to fetch patient records' });
  }
};

// Get a single patient record by ID
const getPatientRecordById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('record_id', sql.Int, id)
      .query(`SELECT r.*, p.full_name AS patient_name
              FROM patient_records r
              JOIN patients p ON r.patient_id = p.patient_id
              WHERE r.record_id = @record_id`);
    const record = result.recordset[0];
    if (!record) {
      return res.status(404).json({ message: 'Patient record not found' });
    }
    res.json(record);
  } catch (error) {
    console.error('Error fetching patient record:', error.message);
    res.status(500).json({ error: 'Failed to fetch patient record' });
  }
};

// Create a new patient record
const createPatientRecord = async (req, res) => {
  const { patient_id, allergies, past_medical_history, current_medications, notes } = req.body;
  if (!patient_id) {
    return res.status(400).json({ message: 'patient_id is required' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .input('allergies', sql.Text, allergies || null)
      .input('past_medical_history', sql.Text, past_medical_history || null)
      .input('current_medications', sql.Text, current_medications || null)
      .input('notes', sql.Text, notes || null)
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO patient_records (patient_id, allergies, past_medical_history, current_medications, notes, created_at)
        OUTPUT INSERTED.*
        VALUES (@patient_id, @allergies, @past_medical_history, @current_medications, @notes, @created_at)`);
    const newRecord = insertResult.recordset[0];
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating patient record:', error.message);
    res.status(500).json({ error: 'Failed to create patient record' });
  }
};

// Update a patient record
const updatePatientRecord = async (req, res) => {
  const { id } = req.params;
  const { allergies, past_medical_history, current_medications, notes } = req.body;
  try {
    await poolConnect;
    // Only update provided fields
    const fields = [];
    if (allergies) fields.push('allergies = @allergies');
    if (past_medical_history) fields.push('past_medical_history = @past_medical_history');
    if (current_medications) fields.push('current_medications = @current_medications');
    if (notes) fields.push('notes = @notes');
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE patient_records SET ${fields.join(', ')} WHERE record_id = @record_id`;
    const request = pool.request().input('record_id', sql.Int, id);
    if (allergies) request.input('allergies', sql.Text, allergies);
    if (past_medical_history) request.input('past_medical_history', sql.Text, past_medical_history);
    if (current_medications) request.input('current_medications', sql.Text, current_medications);
    if (notes) request.input('notes', sql.Text, notes);
    await request.query(updateQuery);
    // Return the updated record
    const result = await pool.request()
      .input('record_id', sql.Int, id)
      .query(`SELECT r.*, p.full_name AS patient_name
              FROM patient_records r
              JOIN patients p ON r.patient_id = p.patient_id
              WHERE r.record_id = @record_id`);
    const updatedRecord = result.recordset[0];
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Patient record not found' });
    }
    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating patient record:', error.message);
    res.status(500).json({ error: 'Failed to update patient record' });
  }
};

// Delete a patient record
const deletePatientRecord = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('record_id', sql.Int, id)
      .query('DELETE FROM patient_records WHERE record_id = @record_id');
    res.json({ message: 'Patient record deleted' });
  } catch (error) {
    console.error('Error deleting patient record:', error.message);
    res.status(500).json({ error: 'Failed to delete patient record' });
  }
};

module.exports = {
  getAllPatientRecords,
  getPatientRecordById,
  createPatientRecord,
  updatePatientRecord,
  deletePatientRecord
}; 