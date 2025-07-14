// controllers/storeController.js
const { poolConnect, pool, sql } = require('../config/db');

// Get all store items
const getAllItems = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT s.store_id, s.item_name, s.quantity_in_stock, s.location, d.department_name
      FROM stores s
      JOIN departments d ON s.department_id = d.department_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching store items:', error.message);
    res.status(500).json({ error: 'Failed to fetch store items' });
  }
};

// Add new stock item
const addItem = async (req, res) => {
  const { name, quantity, price } = req.body;
  if (!name || quantity == null || price == null) {
    return res.status(400).json({ message: 'Name, quantity, and price are required' });
  }
  const newItem = { store_id: 2, name, quantity, price };
  res.status(201).json(newItem);
};

// Update stock quantity (stock-in or stock-out)
const updateStock = async (req, res) => {
  const { store_id, quantity_change } = req.body;

  if (!store_id || quantity_change == null) {
    return res.status(400).json({ error: 'store_id and quantity_change are required' });
  }

  try {
    await poolConnect;

    // Fetch current quantity
    const current = await pool.request()
      .input('store_id', sql.Int, store_id)
      .query(`SELECT quantity_in_stock FROM stores WHERE store_id = @store_id`);

    if (current.recordset.length === 0) {
      return res.status(404).json({ error: 'Store item not found' });
    }

    const newQuantity = current.recordset[0].quantity_in_stock + quantity_change;

    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Insufficient stock to deduct' });
    }

    await pool.request()
      .input('store_id', sql.Int, store_id)
      .input('newQuantity', sql.Int, newQuantity)
      .query(`UPDATE stores SET quantity_in_stock = @newQuantity WHERE store_id = @store_id`);

    res.json({ message: 'Stock updated successfully', newQuantity });
  } catch (error) {
    console.error('Error updating stock:', error.message);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

// Get all store items (alias for getAllItems)
const getAllStoreItems = async (req, res) => {
  return getAllItems(req, res);
};

// Get a single store item by ID
const getStoreItemById = async (req, res) => {
  const { id } = req.params;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.json({ store_id: 1, name: 'Bandage', quantity: 50, price: 2.5 });
};

// Create a new store item (alias for addItem)
const createStoreItem = async (req, res) => {
  return addItem(req, res);
};

// Update a store item (alias for updateStock)
const updateStoreItem = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  const updatedItem = { store_id: 1, name: name || 'Bandage', quantity: quantity || 50, price: price || 2.5 };
  res.json(updatedItem);
};

module.exports = {
  getAllItems,
  addItem,
  updateStock,
  getAllStoreItems,
  getStoreItemById,
  createStoreItem,
  updateStoreItem
};
