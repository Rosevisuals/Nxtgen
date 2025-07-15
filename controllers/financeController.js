// controllers/financeController.js
const { poolConnect, pool, sql } = require('../config/db');

// Get all bills
const getAllBills = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT b.*, p.full_name AS patient_name
      FROM bills b
      JOIN patients p ON b.patient_id = p.patient_id
      ORDER BY b.date_issued DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching bills:', error.message);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// Get a single bill by ID
const getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('bill_id', sql.Int, id)
      .query(`SELECT b.*, p.full_name AS patient_name
              FROM bills b
              JOIN patients p ON b.patient_id = p.patient_id
              WHERE b.bill_id = @bill_id`);
    const bill = result.recordset[0];
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error.message);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

// Create a new bill with items
const createBill = async (req, res) => {
  const { patient_id, amount, date_issued, status, items } = req.body;
  if (!patient_id || !amount || !date_issued || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Required fields missing or no items provided' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('date_issued', sql.Date, date_issued)
      .input('status', sql.VarChar, status || 'unpaid')
      .query(`INSERT INTO bills (patient_id, amount, date_issued, status)
        OUTPUT INSERTED.bill_id
        VALUES (@patient_id, @amount, @date_issued, @status)`);
    const bill_id = insertResult.recordset[0].bill_id;
    // Insert bill items
    for (const item of items) {
      await pool.request()
        .input('bill_id', sql.Int, bill_id)
        .input('description', sql.VarChar, item.description)
        .input('quantity', sql.Int, item.quantity)
        .input('unit_price', sql.Decimal(10, 2), item.unit_price)
        .input('total_price', sql.Decimal(10, 2), item.total_price)
        .query(`INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
          VALUES (@bill_id, @description, @quantity, @unit_price, @total_price)`);
    }
    res.status(201).json({ bill_id });
  } catch (error) {
    console.error('Error creating bill:', error.message);
    res.status(500).json({ error: 'Failed to create bill' });
  }
};

// Get all bill items
const getAllBillItems = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM bill_items');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching bill items:', error.message);
    res.status(500).json({ error: 'Failed to fetch bill items' });
  }
};

// Get bill items by bill_id
const getBillItemsByBillId = async (req, res) => {
  const { bill_id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('bill_id', sql.Int, bill_id)
      .query('SELECT * FROM bill_items WHERE bill_id = @bill_id');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching bill items:', error.message);
    res.status(500).json({ error: 'Failed to fetch bill items' });
  }
};

// Update a bill (status only)
const updateBill = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('bill_id', sql.Int, id)
      .input('status', sql.VarChar, status)
      .query('UPDATE bills SET status = @status WHERE bill_id = @bill_id');
    const result = await pool.request()
      .input('bill_id', sql.Int, id)
      .query('SELECT * FROM bills WHERE bill_id = @bill_id');
    const updated = result.recordset[0];
    if (!updated) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating bill:', error.message);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

// Delete a bill
const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('bill_id', sql.Int, id)
      .query('DELETE FROM bills WHERE bill_id = @bill_id');
    res.json({ message: 'Bill deleted' });
  } catch (error) {
    console.error('Error deleting bill:', error.message);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
};

module.exports = {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  getAllBillItems,
  getBillItemsByBillId
};
