// config/db.js - Database connection configuration
// This file sets up how our application connects to the SQL Server database
// Think of this as the "phone number" and "address" for talking to our database

// Import required packages
const sql = require('mssql');               // mssql is the package that lets us talk to SQL Server
require('dotenv').config();                 // Load environment variables (database credentials)

// ===== DATABASE CONFIGURATION =====
// This object contains all the information needed to connect to our SQL Server database
// We get these values from environment variables (stored in .env file) for security
const config = {
  user: process.env.DB_USER,                // Database username (from .env file)
  password: process.env.DB_PASSWORD,        // Database password (from .env file)
  server: process.env.DB_SERVER,            // Database server address (from .env file)
  database: process.env.DB_DATABASE,        // Database name (from .env file)
  port: parseInt(process.env.DB_PORT),      // Database port (usually 1433 for SQL Server)
  options: {
    encrypt: false,                         // Don't encrypt the connection (for local development)
    trustServerCertificate: true,           // Trust the server's SSL certificate
  },
};

// ===== CREATE CONNECTION POOL =====
// A connection pool is like having multiple phone lines to the database
// Instead of opening/closing connections for each request, we reuse them
// This makes our app much faster!

const pool = new sql.ConnectionPool(config);  // Create a new connection pool with our config
const poolConnect = pool.connect();            // Start connecting to the database

// ===== EXPORT THE CONNECTION =====
// Export these so other files can use the database connection
module.exports = { sql, pool, poolConnect };

// ===== ERROR HANDLING =====
// If something goes wrong with the database connection, log the error
// This helps us debug problems
pool.on('error', (err) => {
  console.error('SQL Pool Error:', err);    // Print the error to the console
});
