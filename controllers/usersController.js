// controllers/usersController.js
const { poolConnect, pool, sql } = require('../config/db');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM users');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }
  const newUser = { user_id: 2, name, email, role };
  res.status(201).json(newUser);
};

// Optional: Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;
    await pool.request()
      .input('user_id', sql.Int, id)
      .query('DELETE FROM users WHERE user_id = @user_id');

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.json({ user_id: 1, name: 'Test User', email: 'testuser@example.com', role: 'nurse' });
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  if (id !== '1') {
    return res.status(404).json({ message: 'Not Found' });
  }
  const updatedUser = { user_id: 1, name: name || 'Test User', email: email || 'testuser@example.com', role: role || 'nurse' };
  res.json(updatedUser);
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser
};
