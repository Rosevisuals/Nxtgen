const { poolConnect, pool, sql } = require('../config/db');

// Ambulances CRUD
const getAllAmbulances = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM ambulances');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching ambulances:', error.message);
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
};

const getAmbulanceById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('ambulance_id', sql.Int, id)
      .query('SELECT * FROM ambulances WHERE ambulance_id = @ambulance_id');
    const ambulance = result.recordset[0];
    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }
    res.json(ambulance);
  } catch (error) {
    console.error('Error fetching ambulance:', error.message);
    res.status(500).json({ error: 'Failed to fetch ambulance' });
  }
};

const createAmbulance = async (req, res) => {
  const { vehicle_number, driver_name, status } = req.body;
  if (!vehicle_number || !driver_name) {
    return res.status(400).json({ message: 'vehicle_number and driver_name are required' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('vehicle_number', sql.VarChar, vehicle_number)
      .input('driver_name', sql.VarChar, driver_name)
      .input('status', sql.VarChar, status || 'available')
      .query('INSERT INTO ambulances (vehicle_number, driver_name, status) OUTPUT INSERTED.* VALUES (@vehicle_number, @driver_name, @status)');
    const newAmbulance = insertResult.recordset[0];
    res.status(201).json(newAmbulance);
  } catch (error) {
    console.error('Error creating ambulance:', error.message);
    res.status(500).json({ error: 'Failed to create ambulance' });
  }
};

const updateAmbulance = async (req, res) => {
  const { id } = req.params;
  const { vehicle_number, driver_name, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (vehicle_number) fields.push('vehicle_number = @vehicle_number');
    if (driver_name) fields.push('driver_name = @driver_name');
    if (status) fields.push('status = @status');
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE ambulances SET ${fields.join(', ')} WHERE ambulance_id = @ambulance_id`;
    const request = pool.request().input('ambulance_id', sql.Int, id);
    if (vehicle_number) request.input('vehicle_number', sql.VarChar, vehicle_number);
    if (driver_name) request.input('driver_name', sql.VarChar, driver_name);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request()
      .input('ambulance_id', sql.Int, id)
      .query('SELECT * FROM ambulances WHERE ambulance_id = @ambulance_id');
    const updatedAmbulance = result.recordset[0];
    if (!updatedAmbulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }
    res.json(updatedAmbulance);
  } catch (error) {
    console.error('Error updating ambulance:', error.message);
    res.status(500).json({ error: 'Failed to update ambulance' });
  }
};

const deleteAmbulance = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('ambulance_id', sql.Int, id)
      .query('DELETE FROM ambulances WHERE ambulance_id = @ambulance_id');
    res.json({ message: 'Ambulance deleted' });
  } catch (error) {
    console.error('Error deleting ambulance:', error.message);
    res.status(500).json({ error: 'Failed to delete ambulance' });
  }
};

// Ambulance Calls CRUD
const getAllAmbulanceCalls = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT c.*, a.vehicle_number, p.full_name AS patient_name
      FROM ambulance_calls c
      JOIN ambulances a ON c.ambulance_id = a.ambulance_id
      JOIN patients p ON c.patient_id = p.patient_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching ambulance calls:', error.message);
    res.status(500).json({ error: 'Failed to fetch ambulance calls' });
  }
};

const getAmbulanceCallById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('call_id', sql.Int, id)
      .query(`SELECT c.*, a.vehicle_number, p.full_name AS patient_name
              FROM ambulance_calls c
              JOIN ambulances a ON c.ambulance_id = a.ambulance_id
              JOIN patients p ON c.patient_id = p.patient_id
              WHERE c.call_id = @call_id`);
    const call = result.recordset[0];
    if (!call) {
      return res.status(404).json({ message: 'Ambulance call not found' });
    }
    res.json(call);
  } catch (error) {
    console.error('Error fetching ambulance call:', error.message);
    res.status(500).json({ error: 'Failed to fetch ambulance call' });
  }
};

const createAmbulanceCall = async (req, res) => {
  const { ambulance_id, patient_id, pickup_location, drop_location, call_time, status } = req.body;
  if (!ambulance_id || !patient_id || !pickup_location || !drop_location || !call_time) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('ambulance_id', sql.Int, ambulance_id)
      .input('patient_id', sql.Int, patient_id)
      .input('pickup_location', sql.Text, pickup_location)
      .input('drop_location', sql.Text, drop_location)
      .input('call_time', sql.DateTime, call_time)
      .input('status', sql.VarChar, status || 'pending')
      .query(`INSERT INTO ambulance_calls (ambulance_id, patient_id, pickup_location, drop_location, call_time, status)
        OUTPUT INSERTED.*
        VALUES (@ambulance_id, @patient_id, @pickup_location, @drop_location, @call_time, @status)`);
    const newCall = insertResult.recordset[0];
    res.status(201).json(newCall);
  } catch (error) {
    console.error('Error creating ambulance call:', error.message);
    res.status(500).json({ error: 'Failed to create ambulance call' });
  }
};

const updateAmbulanceCall = async (req, res) => {
  const { id } = req.params;
  const { ambulance_id, patient_id, pickup_location, drop_location, call_time, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (ambulance_id) fields.push('ambulance_id = @ambulance_id');
    if (patient_id) fields.push('patient_id = @patient_id');
    if (pickup_location) fields.push('pickup_location = @pickup_location');
    if (drop_location) fields.push('drop_location = @drop_location');
    if (call_time) fields.push('call_time = @call_time');
    if (status) fields.push('status = @status');
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE ambulance_calls SET ${fields.join(', ')} WHERE call_id = @call_id`;
    const request = pool.request().input('call_id', sql.Int, id);
    if (ambulance_id) request.input('ambulance_id', sql.Int, ambulance_id);
    if (patient_id) request.input('patient_id', sql.Int, patient_id);
    if (pickup_location) request.input('pickup_location', sql.Text, pickup_location);
    if (drop_location) request.input('drop_location', sql.Text, drop_location);
    if (call_time) request.input('call_time', sql.DateTime, call_time);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request()
      .input('call_id', sql.Int, id)
      .query(`SELECT c.*, a.vehicle_number, p.full_name AS patient_name
              FROM ambulance_calls c
              JOIN ambulances a ON c.ambulance_id = a.ambulance_id
              JOIN patients p ON c.patient_id = p.patient_id
              WHERE c.call_id = @call_id`);
    const updatedCall = result.recordset[0];
    if (!updatedCall) {
      return res.status(404).json({ message: 'Ambulance call not found' });
    }
    res.json(updatedCall);
  } catch (error) {
    console.error('Error updating ambulance call:', error.message);
    res.status(500).json({ error: 'Failed to update ambulance call' });
  }
};

const deleteAmbulanceCall = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('call_id', sql.Int, id)
      .query('DELETE FROM ambulance_calls WHERE call_id = @call_id');
    res.json({ message: 'Ambulance call deleted' });
  } catch (error) {
    console.error('Error deleting ambulance call:', error.message);
    res.status(500).json({ error: 'Failed to delete ambulance call' });
  }
};

module.exports = {
  getAllAmbulances,
  getAmbulanceById,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
  getAllAmbulanceCalls,
  getAmbulanceCallById,
  createAmbulanceCall,
  updateAmbulanceCall,
  deleteAmbulanceCall
}; 