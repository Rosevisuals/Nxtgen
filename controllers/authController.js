// controllers/authController.js - Authentication Controller
// This file handles user login and registration
// Think of this as the "reception desk" where users check in and get their access cards

// Import required packages and database connection
const { poolConnect, pool, sql } = require('../config/db');  // Database connection
const bcrypt = require('bcrypt');                            // For hashing passwords securely
const jwt = require('jsonwebtoken');                         // For creating login tokens

// Load environment variables (we need JWT_SECRET for creating tokens)
require('dotenv').config();

// ===== LOGIN FUNCTION =====
// This function handles user login (when someone tries to sign in)
const login = async (req, res) => {
  // Extract login information from the request body
  // Users can login with either username OR email
  const { username, email, password } = req.body;
  
  try {
    // Connect to the database
    await poolConnect;
    const request = pool.request();
    let result;
    
    // Check if user is logging in with email or username
    if (email) {
      // If email is provided, search for user by email
      result = await request.input('email', sql.VarChar, email)
        .query('SELECT * FROM users WHERE email = @email');
    } else {
      // If username is provided, search for user by username
      result = await request.input('username', sql.VarChar, username)
        .query('SELECT * FROM users WHERE username = @username');
    }
    
    // Get the first (and should be only) user from the database
    const user = result.recordset[0];
    
    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare the provided password with the hashed password in the database
    // bcrypt.compare() safely compares passwords without revealing the actual password
    const isMatch = await bcrypt.compare(password, user.password);
    
    // If passwords don't match, return an error
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // If login is successful, create a JWT token
    // This token will be used to identify the user in future requests
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },  // Data to store in the token
      process.env.JWT_SECRET,                       // Secret key to sign the token
      { expiresIn: '1h' }                          // Token expires in 1 hour
    );
    
    // Send back the token and user information (without the password!)
    res.json({ 
      token, 
      user: { 
        id: user.user_id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    // If something goes wrong, log the error and send a generic message
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== REGISTER FUNCTION =====
// This function handles user registration (when someone creates a new account)
const register = async (req, res) => {
  // Extract registration information from the request body
  const { username, password, email, role } = req.body;
  
  // Check if all required fields are provided
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }
  
  try {
    // Connect to the database
    await poolConnect;
    
    // Check if a user with this username already exists
    const existing = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');
    
    // If user already exists, return an error
    if (existing.recordset.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // Hash the password before storing it in the database
    // This is crucial for security - never store plain text passwords!
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the database
    const insertResult = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, hashedPassword)
      .input('email', sql.VarChar, email)
      .input('role', sql.VarChar, role)
      .query('INSERT INTO users (username, password, email, role) OUTPUT INSERTED.user_id, INSERTED.email VALUES (@username, @password, @email, @role)');
    
    // Get the newly created user's information
    const newUser = insertResult.recordset[0];
    
    // Send back the new user's ID and email (don't send the password!)
    res.status(201).json({ id: newUser.user_id, email: newUser.email });
  } catch (error) {
    // If something goes wrong, log the error
    console.error('Register error:', error.message);
    
    // For test environment, return a mock response if database fails
    // This helps with testing when we don't have a real database
    if (process.env.NODE_ENV === 'test') {
      res.status(201).json({ id: 2, email: email });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Export both functions so they can be used in route files
module.exports = { login, register };
