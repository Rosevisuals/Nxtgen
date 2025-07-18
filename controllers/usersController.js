// controllers/usersController.js
const usersModel = require('../models/usersModel');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error, error && error.stack);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { full_Name, email, phone, password, gender, DOB, marital_status, Address, status } = req.body;
  if (!full_Name || !email || !password) {
    return res.status(400).json({ message: 'full_Name, email, and password are required' });
  }
  try {
    // Check if a user with this email already exists
    const existing = await usersModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const user = {
      full_Name,
      email,
      phone: phone || null,
      password_hash: hashedPassword,
      gender: gender || null,
      DOB: DOB || null,
      marital_status: marital_status || null,
      Address: Address || null,
      status: status || 'active',
      created_at: now
    };
    const newUser = await usersModel.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUser:', error, error && error.stack);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await usersModel.deleteUser(id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error in deleteUser:', error, error && error.stack);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error, error && error.stack);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    // If password is being updated, hash it
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    const updatedUser = await usersModel.updateUser(id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Not Found or no fields to update' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error in updateUser:', error, error && error.stack);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Fetch all roles (unchanged)
const { poolConnect, pool } = require('../config/db');
const getAllRoles = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM roles');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error in getAllRoles:', error, error && error.stack);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
  getAllRoles
};
