// controllers/authController.js - Authentication Controller (ERP4 Schema)
const usersModel = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// LOGIN FUNCTION (email + password)
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    // Find user by email
    const user = await usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check status
    if (user.status && user.status.toLowerCase() !== 'active') {
      return res.status(403).json({ message: 'User is not active' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // Check if user is staff and fetch role
    let role = null;
    try {
      role = await usersModel.getStaffRoleByUserId(user.user_id);
    } catch (e) {
      // Ignore errors, treat as non-staff
    }
    // Create JWT token
    const tokenPayload = { user_id: user.user_id, email: user.email };
    if (role) tokenPayload.role = role;
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Return token and user info (no password hash)
    res.json({
      token,
      user: {
        user_id: user.user_id,
        full_Name: user.full_Name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        DOB: user.DOB,
        marital_status: user.marital_status,
        Address: user.Address,
        status: user.status,
        created_at: user.created_at,
        role: role || undefined
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// REGISTER FUNCTION (email + password + full_Name + ...)
const register = async (req, res) => {
  const { full_Name, email, phone, password, gender, DOB, marital_status, Address, status } = req.body;
  if (!full_Name || !email || !password) {
    return res.status(400).json({ message: 'full_Name, email, and password are required' });
  }
  try {
    // Check if user with this email already exists
    const existing = await usersModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user object
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
    // Insert user and return full user object
    const newUser = await usersModel.createUser(user);
    // Return new user info (no password hash)
    res.status(201).json({
      user_id: newUser.user_id,
      full_Name: newUser.full_Name,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
      DOB: newUser.DOB,
      marital_status: newUser.marital_status,
      Address: newUser.Address,
      status: newUser.status,
      created_at: newUser.created_at
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };
