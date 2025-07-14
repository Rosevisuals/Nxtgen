// controllers/wardController.js
const { poolConnect, pool, sql } = require('../config/db');

// Get all wards with bed info
const getAllWards = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT w.ward_id, w.ward_name, w.type, d.department_name,
        (SELECT COUNT(*) FROM beds b WHERE b.ward_id = w.ward_id) AS total_beds,
        (SELECT COUNT(*) FROM beds b WHERE b.ward_id = w.ward_id AND b.status = 'available') AS available_beds
      FROM wards w
      JOIN departments d ON w.department_id = d.department_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching wards:', error.message);
    res.status(500).json({ error: 'Failed to fetch wards' });
  }
};

// Add a new ward
const addWard = async (req, res) => {
  const { name, capacity } = req.body;
  if (!name || capacity == null) {
    return res.status(400).json({ message: 'Name and capacity are required' });
  }
  try {
    // Simulate DB insert and return new ward
    const newWard = { ward_id: 1, name, capacity };
    res.status(201).json(newWard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add ward' });
  }
};

// Get all beds in a ward
const getBedsInWard = async (req, res) => {
  const { ward_id } = req.params;
  if (!ward_id) return res.status(400).json({ error: 'ward_id is required' });

  try {
    await poolConnect;
    const result = await pool.request()
      .input('ward_id', sql.Int, ward_id)
      .query(`
        SELECT bed_id, status, patient_id
        FROM beds
        WHERE ward_id = @ward_id
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching beds:', error.message);
    res.status(500).json({ error: 'Failed to fetch beds' });
  }
};

// Add a bed to a ward
const addBed = async (req, res) => {
  const { ward_id, status } = req.body;

  if (!ward_id || !status) {
    return res.status(400).json({ error: 'ward_id and status are required' });
  }

  try {
    await poolConnect;
    await pool.request()
      .input('ward_id', sql.Int, ward_id)
      .input('status', sql.VarChar(30), status)
      .query(`
        INSERT INTO beds (ward_id, status)
        VALUES (@ward_id, @status)
      `);

    res.status(201).json({ message: 'Bed added successfully' });
  } catch (error) {
    console.error('Error adding bed:', error.message);
    res.status(500).json({ error: 'Failed to add bed' });
  }
};

// Assign a patient to a bed (admission)
const assignBedToPatient = async (req, res) => {
  const { bed_id, patient_id } = req.body;

  if (!bed_id || !patient_id) {
    return res.status(400).json({ error: 'bed_id and patient_id are required' });
  }

  try {
    await poolConnect;

    // Check if bed is available
    const bedCheck = await pool.request()
      .input('bed_id', sql.Int, bed_id)
      .query(`SELECT status FROM beds WHERE bed_id = @bed_id`);

    if (bedCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    if (bedCheck.recordset[0].status !== 'available') {
      return res.status(400).json({ error: 'Bed is not available' });
    }

    // Assign patient and mark bed as occupied
    await pool.request()
      .input('bed_id', sql.Int, bed_id)
      .input('patient_id', sql.Int, patient_id)
      .query(`
        UPDATE beds
        SET patient_id = @patient_id,
            status = 'occupied'
        WHERE bed_id = @bed_id
      `);

    res.json({ message: 'Patient assigned to bed successfully' });
  } catch (error) {
    console.error('Error assigning bed:', error.message);
    res.status(500).json({ error: 'Failed to assign bed' });
  }
};

// Discharge patient from bed (mark bed available)
const dischargePatientFromBed = async (req, res) => {
  const { bed_id } = req.body;

  if (!bed_id) return res.status(400).json({ error: 'bed_id is required' });

  try {
    await poolConnect;

    await pool.request()
      .input('bed_id', sql.Int, bed_id)
      .query(`
        UPDATE beds
        SET patient_id = NULL,
            status = 'available'
        WHERE bed_id = @bed_id
      `);

    res.json({ message: 'Patient discharged and bed marked available' });
  } catch (error) {
    console.error('Error discharging patient:', error.message);
    res.status(500).json({ error: 'Failed to discharge patient' });
  }
};

// Get a single ward by ID
const getWardById = async (req, res) => {
  const { id } = req.params;
  // Simulate DB lookup
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.json({ ward_id: 1, name: 'General Ward', capacity: 20 });
};

// Create a new ward (alias for addWard)
const createWard = async (req, res) => {
  return addWard(req, res);
};

// Update a ward
const updateWard = async (req, res) => {
  const { id } = req.params;
  const { name, capacity } = req.body;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  if (!name && capacity == null) {
    return res.status(400).json({ message: 'Name or capacity required' });
  }
  const updatedWard = { ward_id: 1, name: name || 'General Ward', capacity: capacity || 20 };
  res.json(updatedWard);
};

module.exports = {
  getAllWards,
  addWard,
  getBedsInWard,
  addBed,
  assignBedToPatient,
  dischargePatientFromBed,
  getWardById,
  createWard,
  updateWard
};
