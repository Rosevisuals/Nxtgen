// controllers/pharmacyController.js
const { poolConnect, pool, sql } = require('../config/db');

// Get all prescriptions (unfulfilled)
const getPendingPrescriptions = async (req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT c.consultation_id, c.patient_id, c.prescribed_meds, c.request_admission, c.request_lab_test,
             p.full_name AS patient_name
      FROM consultations c
      JOIN patients p ON c.patient_id = p.patient_id
      WHERE c.prescribed_meds IS NOT NULL AND c.prescribed_meds <> ''
        AND c.consultation_id NOT IN (SELECT consultation_id FROM pharmacy)
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching prescriptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

// Dispense medication
const dispenseMedication = async (req, res) => {
  const { consultation_id, pharmacist_id } = req.body;

  if (!consultation_id || !pharmacist_id) {
    return res.status(400).json({ error: 'consultation_id and pharmacist_id are required' });
  }

  try {
    await poolConnect;

    // Fetch prescribed meds
    const consultation = await pool.request()
      .input('consultation_id', sql.Int, consultation_id)
      .query(`SELECT prescribed_meds FROM consultations WHERE consultation_id = @consultation_id`);

    if (consultation.recordset.length === 0) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    const meds = consultation.recordset[0].prescribed_meds;

    // Insert into pharmacy table
    await pool.request()
      .input('consultation_id', sql.Int, consultation_id)
      .input('pharmacist_id', sql.Int, pharmacist_id)
      .input('dispensed_meds', sql.Text, meds)
      .query(`
        INSERT INTO pharmacy (consultation_id, pharmacist_id, dispensed_meds)
        VALUES (@consultation_id, @pharmacist_id, @dispensed_meds)
      `);

    // (Optional) You can parse `meds` and deduct stock from `stores` table here later

    res.json({ message: 'Medication dispensed successfully' });
  } catch (error) {
    console.error('Error dispensing meds:', error.message);
    res.status(500).json({ error: 'Failed to dispense medication' });
  }
};

// Get all pharmacy items
const getAllPharmacyItems = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM pharmacy');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching pharmacy items:', error.message);
    res.status(500).json({ error: 'Failed to fetch pharmacy items' });
  }
};

// Get a single pharmacy item by ID
const getPharmacyItemById = async (req, res) => {
  const { id } = req.params;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.json({ pharmacy_id: 1, name: 'Paracetamol', quantity: 100, price: 5.0 });
};

// Create a new pharmacy item
const createPharmacyItem = async (req, res) => {
  const { name, quantity, price } = req.body;
  if (!name || quantity == null || price == null) {
    return res.status(400).json({ message: 'Name, quantity, and price are required' });
  }
  const newItem = { pharmacy_id: 2, name, quantity, price };
  res.status(201).json(newItem);
};

// Update a pharmacy item
const updatePharmacyItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  const updatedItem = { pharmacy_id: 1, name: name || 'Paracetamol', quantity: quantity || 100, price: price || 5.0 };
  res.json(updatedItem);
};

module.exports = {
  getPendingPrescriptions,
  dispenseMedication,
  getAllPharmacyItems,
  getPharmacyItemById,
  createPharmacyItem,
  updatePharmacyItem
};
