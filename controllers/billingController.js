// controllers/billingController.js - Billing Management Controller

const Bill = require('../models/billingModel');

// ===== GET ALL BILLS FUNCTION =====
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll();
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error.message);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// ===== GET BILL BY ID FUNCTION =====
const getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error.message);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

// ===== CREATE BILL FUNCTION =====
const createBill = async (req, res) => {
  const { patient_id, amount, status, due_date } = req.body;
  if (!patient_id || !amount || !status || !due_date) {
    return res.status(400).json({ message: 'Required bill data missing' });
  }
  try {
    const newBill = await Bill.create(req.body);
    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error creating bill:', error.message);
    res.status(500).json({ error: 'Failed to create bill' });
  }
};

// ===== UPDATE BILL FUNCTION =====
const updateBill = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBill = await Bill.update(id, req.body);
    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error.message);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

// ===== DELETE BILL FUNCTION =====
const deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Bill.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
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
  deleteBill
};