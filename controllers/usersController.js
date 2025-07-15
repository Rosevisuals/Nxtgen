// controllers/usersController.js
const { poolConnect, pool, sql } = require('../config/db');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.role_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { full_name, username, email, phone, password, role_id, profile_picture, status } = req.body;
  if (!full_name || !username || !email || !password || !role_id) {
    return res.status(400).json({ message: 'full_name, username, email, password, and role_id are required' });
  }
  try {
    await poolConnect;
    // Check if a user with this username or email already exists
    const existing = await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE username = @username OR email = @email');
    if (existing.recordset.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const insertResult = await pool.request()
      .input('full_name', sql.VarChar, full_name)
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('password_hash', sql.VarChar, hashedPassword)
      .input('role_id', sql.Int, role_id)
      .input('profile_picture', sql.VarChar, profile_picture || null)
      .input('status', sql.VarChar, status || 'active')
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO users (full_name, username, email, phone, password_hash, role_id, profile_picture, status, created_at)
        OUTPUT INSERTED.user_id, INSERTED.full_name, INSERTED.username, INSERTED.email, INSERTED.phone, INSERTED.role_id, INSERTED.profile_picture, INSERTED.status, INSERTED.created_at
        VALUES (@full_name, @username, @email, @phone, @password_hash, @role_id, @profile_picture, @status, @created_at)`);
    const newUser = insertResult.recordset[0];
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
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
  try {
    await poolConnect;
    const result = await pool.request()
      .input('user_id', sql.Int, id)
      .query(`SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.role_id WHERE u.user_id = @user_id`);
    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, username, email, phone, role_id, profile_picture, status } = req.body;
  try {
    await poolConnect;
    // Only update provided fields
    const fields = [];
    if (full_name) fields.push(`full_name = @full_name`);
    if (username) fields.push(`username = @username`);
    if (email) fields.push(`email = @email`);
    if (phone) fields.push(`phone = @phone`);
    if (role_id) fields.push(`role_id = @role_id`);
    if (profile_picture) fields.push(`profile_picture = @profile_picture`);
    if (status) fields.push(`status = @status`);
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE user_id = @user_id`;
    const request = pool.request().input('user_id', sql.Int, id);
    if (full_name) request.input('full_name', sql.VarChar, full_name);
    if (username) request.input('username', sql.VarChar, username);
    if (email) request.input('email', sql.VarChar, email);
    if (phone) request.input('phone', sql.VarChar, phone);
    if (role_id) request.input('role_id', sql.Int, role_id);
    if (profile_picture) request.input('profile_picture', sql.VarChar, profile_picture);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    // Return the updated user
    const result = await pool.request()
      .input('user_id', sql.Int, id)
      .query(`SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.role_id WHERE u.user_id = @user_id`);
    const updatedUser = result.recordset[0];
    if (!updatedUser) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Fetch all roles
const getAllRoles = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM roles');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching roles:', error.message);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
  getAllRoles
};
