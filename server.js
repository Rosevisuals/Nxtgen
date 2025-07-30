// server.js - This is the main entry point for our Hospital ERP Backend application
// Think of this as the "front door" that starts our entire server

// Import required packages (these are like tools we need to build our server)
const express = require('express');        // Express is a web framework that makes it easy to create APIs
const cors = require('cors');              // CORS allows our frontend to talk to our backend (security feature)
const dotenv = require('dotenv');          // dotenv loads environment variables from a .env file
dotenv.config(); // This line actually loads the environment variables

const helmet = require('helmet'); // Helmet helps secure your apps by setting various HTTP headers
const rateLimit = require('express-rate-limit'); // Rate limiting middleware to prevent abuse
const logger = require('./config/logger'); // Import our custom logger
const morgan = require('morgan'); // HTTP request logger middleware
const { authenticateToken } = require('./middleware/authMiddleware');

// Create our Express application (this is like creating a new web server)
const app = express();
const PORT = process.env.PORT || 5000;     // Use the port from .env file, or default to 5000

// ===== MIDDLEWARE SETUP =====
// Middleware are functions that run before your actual route handlers
// Think of them as security guards or helpers that process requests

app.use(cors());                           // Allow cross-origin requests (frontend can call backend)
app.use(express.json()); // Parse JSON data from incoming requests

// ===== SECURITY & LOGGING MIDDLEWARE =====
app.use(helmet()); // Use helmet to set security headers

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// HTTP Request Logging with Morgan, integrated with Winston
// This will log all incoming HTTP requests to our log files
const stream = {
  write: (message) => logger.http(message.trim()),
};
app.use(morgan('combined', { stream }));

// ===== ROUTE SETUP =====
// Routes are like different "rooms" in our hospital - each handles a specific type of data
// When someone visits /api/patients, they go to the patients "room"

app.use('/api/auth', require('./routes/auth'));           // Authentication routes (login, register)
app.use('/api/users', require('./routes/users'));         // User management routes
app.use('/api/roles', require('./routes/roles'));           // Roles management routes
app.use('/api/appointments', require('./routes/appointments')); // Appointment scheduling routes
app.use('/api/departments', require('./routes/departments')); // Department routes
app.use('/api/billing', require('./routes/billing')); // Billing routes
app.use('/api/prescriptions', require('./routes/prescriptions')); // Prescriptions routes
// app.use('/api/consultation', require('./routes/consultation')); // Medical consultation routes (not implemented yet)
app.use('/api/pharmacy', require('./routes/pharmacy'));   // Pharmacy management routes
app.use('/api/patients', require('./routes/patients'));   // Patient routes
// // app.use('/api/finance', require('./routes/finance'));     // Financial management routes
// // app.use('/api/store', require('./routes/store'));         // Store/inventory routes
// // // app.use('/api/doctors', require('./routes/doctors'));
// // app.use('/api/patient_records', require('./routes/patient_records'));
// // app.use('/api/ambulances', require('./routes/ambulances'));
// // app.use('/api/blood', require('./routes/blood'));
// // app.use('/api/rooms', require('./routes/rooms'));
// // app.use('/api/notifications', require('./routes/notifications'));
// // app.use('/api/working_hours', require('./routes/working_hours'));
// // app.use('/api/support_tickets', require('./routes/support_tickets'));
// // app.use('/api/chats', require('./routes/chats'));
// // app.use('/api/emails', require('./routes/emails'));
// // app.use('/api/reports', require('./routes/reports'));
app.use('/api/test-types', authenticateToken, require('./routes/test-types'));
app.use('/api/conditions', authenticateToken, require('./routes/conditions'));
app.use('/api/wards', authenticateToken, require('./routes/wards'));
app.use('/api/diagnoses', authenticateToken, require('./routes/diagnoses'));
app.use('/api/lab-requests', authenticateToken, require('./routes/lab-requests'));
app.use('/api/beds', authenticateToken, require('./routes/beds'));
app.use('/api/staff', authenticateToken, require('./routes/staff'));

// ===== ROOT ROUTE =====
// This is what people see when they visit the main URL (like http://localhost:5000/)
app.get('/', (req, res) => {
  res.send('🏥 ERP Backend Running'); // Send a simple message to show the server is working
});

// ===== ERROR HANDLING MIDDLEWARE =====
// This middleware will catch any errors that occur in the application
// It's important to define it AFTER all other app.use() and routes calls
const errorHandler = (err, req, res, next) => {
  // Log the error internally
  logger.error(err.message, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak stack traces to the client in production
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

app.use(errorHandler);

// ===== START THE SERVER =====
// Only start the server if we're NOT running tests
// This prevents conflicts when running automated tests
if (process.env.NODE_ENV !== 'test' && process.env.JEST_WORKER_ID === undefined) {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`); // Use logger instead of console.log
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

// Export the app so other files (like tests) can use it
module.exports = app;
