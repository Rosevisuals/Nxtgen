const { poolConnect, pool, sql } = require('../config/db');

// ===== BLOOD DONORS CRUD =====
const getAllBloodDonors = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM blood_donors');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching blood donors:', error.message);
    res.status(500).json({ error: 'Failed to fetch blood donors' });
  }
};

const getBloodDonorById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('donor_id', sql.Int, id)
      .query('SELECT * FROM blood_donors WHERE donor_id = @donor_id');
    const donor = result.recordset[0];
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (error) {
    console.error('Error fetching blood donor:', error.message);
    res.status(500).json({ error: 'Failed to fetch blood donor' });
  }
};

const createBloodDonor = async (req, res) => {
  const { full_name, blood_type, contact_number, address, date_of_birth, gender, last_donation_date } = req.body;
  if (!full_name || !blood_type || !contact_number) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('full_name', sql.VarChar, full_name)
      .input('blood_type', sql.VarChar, blood_type)
      .input('contact_number', sql.VarChar, contact_number)
      .input('address', sql.VarChar, address || null)
      .input('date_of_birth', sql.Date, date_of_birth || null)
      .input('gender', sql.VarChar, gender || null)
      .input('last_donation_date', sql.Date, last_donation_date || null)
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO blood_donors (full_name, blood_type, contact_number, address, date_of_birth, gender, last_donation_date, created_at)
        OUTPUT INSERTED.*
        VALUES (@full_name, @blood_type, @contact_number, @address, @date_of_birth, @gender, @last_donation_date, @created_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating blood donor:', error.message);
    res.status(500).json({ error: 'Failed to create blood donor' });
  }
};

const updateBloodDonor = async (req, res) => {
  const { id } = req.params;
  const { full_name, blood_type, contact_number, address, date_of_birth, gender, last_donation_date } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (full_name) fields.push('full_name = @full_name');
    if (blood_type) fields.push('blood_type = @blood_type');
    if (contact_number) fields.push('contact_number = @contact_number');
    if (address) fields.push('address = @address');
    if (date_of_birth) fields.push('date_of_birth = @date_of_birth');
    if (gender) fields.push('gender = @gender');
    if (last_donation_date) fields.push('last_donation_date = @last_donation_date');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE blood_donors SET ${fields.join(', ')} WHERE donor_id = @donor_id`;
    const request = pool.request().input('donor_id', sql.Int, id);
    if (full_name) request.input('full_name', sql.VarChar, full_name);
    if (blood_type) request.input('blood_type', sql.VarChar, blood_type);
    if (contact_number) request.input('contact_number', sql.VarChar, contact_number);
    if (address) request.input('address', sql.VarChar, address);
    if (date_of_birth) request.input('date_of_birth', sql.Date, date_of_birth);
    if (gender) request.input('gender', sql.VarChar, gender);
    if (last_donation_date) request.input('last_donation_date', sql.Date, last_donation_date);
    await request.query(updateQuery);
    const result = await pool.request().input('donor_id', sql.Int, id).query('SELECT * FROM blood_donors WHERE donor_id = @donor_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Donor not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating blood donor:', error.message);
    res.status(500).json({ error: 'Failed to update blood donor' });
  }
};

const deleteBloodDonor = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('donor_id', sql.Int, id).query('DELETE FROM blood_donors WHERE donor_id = @donor_id');
    res.json({ message: 'Blood donor deleted' });
  } catch (error) {
    console.error('Error deleting blood donor:', error.message);
    res.status(500).json({ error: 'Failed to delete blood donor' });
  }
};

// ===== BLOOD STOCK CRUD =====
const getAllBloodStock = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT s.*, d.full_name AS donor_name
      FROM blood_stock s
      LEFT JOIN blood_donors d ON s.donor_id = d.donor_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching blood stock:', error.message);
    res.status(500).json({ error: 'Failed to fetch blood stock' });
  }
};

const getBloodStockById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('stock_id', sql.Int, id)
      .query('SELECT * FROM blood_stock WHERE stock_id = @stock_id');
    const stock = result.recordset[0];
    if (!stock) return res.status(404).json({ message: 'Blood stock not found' });
    res.json(stock);
  } catch (error) {
    console.error('Error fetching blood stock:', error.message);
    res.status(500).json({ error: 'Failed to fetch blood stock' });
  }
};

const createBloodStock = async (req, res) => {
  const { blood_type, quantity, expiry_date, donor_id, storage_location, status } = req.body;
  if (!blood_type || !quantity || !expiry_date) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('blood_type', sql.VarChar, blood_type)
      .input('quantity', sql.Int, quantity)
      .input('expiry_date', sql.Date, expiry_date)
      .input('donor_id', sql.Int, donor_id || null)
      .input('storage_location', sql.VarChar, storage_location || null)
      .input('status', sql.VarChar, status || 'available')
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO blood_stock (blood_type, quantity, expiry_date, donor_id, storage_location, status, created_at)
        OUTPUT INSERTED.*
        VALUES (@blood_type, @quantity, @expiry_date, @donor_id, @storage_location, @status, @created_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating blood stock:', error.message);
    res.status(500).json({ error: 'Failed to create blood stock' });
  }
};

const updateBloodStock = async (req, res) => {
  const { id } = req.params;
  const { blood_type, quantity, expiry_date, donor_id, storage_location, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (blood_type) fields.push('blood_type = @blood_type');
    if (quantity != null) fields.push('quantity = @quantity');
    if (expiry_date) fields.push('expiry_date = @expiry_date');
    if (donor_id) fields.push('donor_id = @donor_id');
    if (storage_location) fields.push('storage_location = @storage_location');
    if (status) fields.push('status = @status');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE blood_stock SET ${fields.join(', ')} WHERE stock_id = @stock_id`;
    const request = pool.request().input('stock_id', sql.Int, id);
    if (blood_type) request.input('blood_type', sql.VarChar, blood_type);
    if (quantity != null) request.input('quantity', sql.Int, quantity);
    if (expiry_date) request.input('expiry_date', sql.Date, expiry_date);
    if (donor_id) request.input('donor_id', sql.Int, donor_id);
    if (storage_location) request.input('storage_location', sql.VarChar, storage_location);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request().input('stock_id', sql.Int, id).query('SELECT * FROM blood_stock WHERE stock_id = @stock_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Blood stock not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating blood stock:', error.message);
    res.status(500).json({ error: 'Failed to update blood stock' });
  }
};

const deleteBloodStock = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('stock_id', sql.Int, id).query('DELETE FROM blood_stock WHERE stock_id = @stock_id');
    res.json({ message: 'Blood stock deleted' });
  } catch (error) {
    console.error('Error deleting blood stock:', error.message);
    res.status(500).json({ error: 'Failed to delete blood stock' });
  }
};

// ===== BLOOD ISSUED CRUD =====
const getAllBloodIssued = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT i.*, p.full_name AS patient_name, d.full_name AS doctor_name, s.blood_type
      FROM blood_issued i
      JOIN patients p ON i.patient_id = p.patient_id
      JOIN doctors d ON i.doctor_id = d.doctor_id
      JOIN blood_stock s ON i.stock_id = s.stock_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching blood issued:', error.message);
    res.status(500).json({ error: 'Failed to fetch blood issued records' });
  }
};

const getBloodIssuedById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('issue_id', sql.Int, id)
      .query('SELECT * FROM blood_issued WHERE issue_id = @issue_id');
    const issued = result.recordset[0];
    if (!issued) return res.status(404).json({ message: 'Blood issued record not found' });
    res.json(issued);
  } catch (error) {
    console.error('Error fetching blood issued record:', error.message);
    res.status(500).json({ error: 'Failed to fetch blood issued record' });
  }
};

const createBloodIssued = async (req, res) => {
  const { patient_id, doctor_id, stock_id, quantity, date_issued, notes } = req.body;
  if (!patient_id || !doctor_id || !stock_id || !quantity || !date_issued) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    // Decrement stock quantity
    const stockResult = await pool.request().input('stock_id', sql.Int, stock_id).query('SELECT quantity FROM blood_stock WHERE stock_id = @stock_id');
    const stock = stockResult.recordset[0];
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient blood stock' });
    }
    await pool.request().input('stock_id', sql.Int, stock_id).input('quantity', sql.Int, stock.quantity - quantity).query('UPDATE blood_stock SET quantity = @quantity WHERE stock_id = @stock_id');
    // Insert issued record
    const insertResult = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .input('doctor_id', sql.Int, doctor_id)
      .input('stock_id', sql.Int, stock_id)
      .input('quantity', sql.Int, quantity)
      .input('date_issued', sql.Date, date_issued)
      .input('notes', sql.Text, notes || null)
      .query(`INSERT INTO blood_issued (patient_id, doctor_id, stock_id, quantity, date_issued, notes)
        OUTPUT INSERTED.*
        VALUES (@patient_id, @doctor_id, @stock_id, @quantity, @date_issued, @notes)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error issuing blood:', error.message);
    res.status(500).json({ error: 'Failed to issue blood' });
  }
};

const updateBloodIssued = async (req, res) => {
  const { id } = req.params;
  const { quantity, date_issued, notes } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (quantity != null) fields.push('quantity = @quantity');
    if (date_issued) fields.push('date_issued = @date_issued');
    if (notes) fields.push('notes = @notes');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE blood_issued SET ${fields.join(', ')} WHERE issue_id = @issue_id`;
    const request = pool.request().input('issue_id', sql.Int, id);
    if (quantity != null) request.input('quantity', sql.Int, quantity);
    if (date_issued) request.input('date_issued', sql.Date, date_issued);
    if (notes) request.input('notes', sql.Text, notes);
    await request.query(updateQuery);
    const result = await pool.request().input('issue_id', sql.Int, id).query('SELECT * FROM blood_issued WHERE issue_id = @issue_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Blood issued record not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating blood issued record:', error.message);
    res.status(500).json({ error: 'Failed to update blood issued record' });
  }
};

const deleteBloodIssued = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('issue_id', sql.Int, id).query('DELETE FROM blood_issued WHERE issue_id = @issue_id');
    res.json({ message: 'Blood issued record deleted' });
  } catch (error) {
    console.error('Error deleting blood issued record:', error.message);
    res.status(500).json({ error: 'Failed to delete blood issued record' });
  }
};

module.exports = {
  // Blood Donors
  getAllBloodDonors,
  getBloodDonorById,
  createBloodDonor,
  updateBloodDonor,
  deleteBloodDonor,
  // Blood Stock
  getAllBloodStock,
  getBloodStockById,
  createBloodStock,
  updateBloodStock,
  deleteBloodStock,
  // Blood Issued
  getAllBloodIssued,
  getBloodIssuedById,
  createBloodIssued,
  updateBloodIssued,
  deleteBloodIssued
}; 