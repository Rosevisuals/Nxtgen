// controllers/pharmacyController.js
const { poolConnect, pool, sql } = require('../config/db');

// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT p.*, a.appointment_date, a.appointment_time, d.full_name AS doctor_name, pt.full_name AS patient_name
      FROM prescriptions p
      JOIN appointments a ON p.appointment_id = a.appointment_id
      JOIN doctors d ON p.doctor_id = d.doctor_id
      JOIN patients pt ON p.patient_id = pt.patient_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching prescriptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

// Get a single prescription by ID
const getPrescriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('prescription_id', sql.Int, id)
      .query(`SELECT p.*, a.appointment_date, a.appointment_time, d.full_name AS doctor_name, pt.full_name AS patient_name
              FROM prescriptions p
              JOIN appointments a ON p.appointment_id = a.appointment_id
              JOIN doctors d ON p.doctor_id = d.doctor_id
              JOIN patients pt ON p.patient_id = pt.patient_id
              WHERE p.prescription_id = @prescription_id`);
    const prescription = result.recordset[0];
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
};

// Create a new prescription with items
const createPrescription = async (req, res) => {
  const { appointment_id, doctor_id, patient_id, date_issued, notes, items } = req.body;
  if (!appointment_id || !doctor_id || !patient_id || !date_issued || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Required fields missing or no items provided' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('appointment_id', sql.Int, appointment_id)
      .input('doctor_id', sql.Int, doctor_id)
      .input('patient_id', sql.Int, patient_id)
      .input('date_issued', sql.Date, date_issued)
      .input('notes', sql.Text, notes || null)
      .query(`INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, date_issued, notes)
        OUTPUT INSERTED.prescription_id
        VALUES (@appointment_id, @doctor_id, @patient_id, @date_issued, @notes)`);
    const prescription_id = insertResult.recordset[0].prescription_id;
    // Insert prescription items
    for (const item of items) {
      await pool.request()
        .input('prescription_id', sql.Int, prescription_id)
        .input('medicine_name', sql.VarChar, item.medicine_name)
        .input('dosage', sql.VarChar, item.dosage)
        .input('duration', sql.VarChar, item.duration)
        .input('instructions', sql.Text, item.instructions)
        .query(`INSERT INTO prescription_items (prescription_id, medicine_name, dosage, duration, instructions)
          VALUES (@prescription_id, @medicine_name, @dosage, @duration, @instructions)`);
    }
    res.status(201).json({ prescription_id });
  } catch (error) {
    console.error('Error creating prescription:', error.message);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

// Get all prescription items
const getAllPrescriptionItems = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM prescription_items');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching prescription items:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescription items' });
  }
};

// Get prescription items by prescription_id
const getPrescriptionItemsByPrescriptionId = async (req, res) => {
  const { prescription_id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('prescription_id', sql.Int, prescription_id)
      .query('SELECT * FROM prescription_items WHERE prescription_id = @prescription_id');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching prescription items:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescription items' });
  }
};

// Update a prescription (notes only)
const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('prescription_id', sql.Int, id)
      .input('notes', sql.Text, notes)
      .query('UPDATE prescriptions SET notes = @notes WHERE prescription_id = @prescription_id');
    const result = await pool.request()
      .input('prescription_id', sql.Int, id)
      .query('SELECT * FROM prescriptions WHERE prescription_id = @prescription_id');
    const updated = result.recordset[0];
    if (!updated) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating prescription:', error.message);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
};

// Delete a prescription
const deletePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('prescription_id', sql.Int, id)
      .query('DELETE FROM prescriptions WHERE prescription_id = @prescription_id');
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    console.error('Error deleting prescription:', error.message);
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getAllPrescriptionItems,
  getPrescriptionItemsByPrescriptionId
};
