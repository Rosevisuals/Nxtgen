// server.js - This is the main entry point for our Hospital ERP Backend application
// Think of this as the "front door" that starts our entire server

// Import required packages (these are like tools we need to build our server)
const express = require('express');        // Express is a web framework that makes it easy to create APIs
const cors = require('cors');              // CORS allows our frontend to talk to our backend (security feature)
const dotenv = require('dotenv');          // dotenv loads environment variables from a .env file
dotenv.config();                           // This line actually loads the environment variables

// Create our Express application (this is like creating a new web server)
const app = express();
const PORT = process.env.PORT || 5000;     // Use the port from .env file, or default to 5000

// ===== MIDDLEWARE SETUP =====
// Middleware are functions that run before your actual route handlers
// Think of them as security guards or helpers that process requests

app.use(cors());                           // Allow cross-origin requests (frontend can call backend)
app.use(express.json());                   // Parse JSON data from incoming requests

// ===== ROUTE SETUP =====
// Routes are like different "rooms" in our hospital - each handles a specific type of data
// When someone visits /api/patients, they go to the patients "room"

app.use('/api/auth', require('./routes/auth'));           // Authentication routes (login, register)
app.use('/api/users', require('./routes/users'));         // User management routes
// app.use('/api/patients', require('./routes/patients'));   // Patient management routes
// app.use('/api/appointments', require('./routes/appointments')); // Appointment scheduling routes
// app.use('/api/consultation', require('./routes/consultation')); // Medical consultation routes
// app.use('/api/pharmacy', require('./routes/pharmacy'));   // Pharmacy management routes
// app.use('/api/finance', require('./routes/finance'));     // Financial management routes
// app.use('/api/store', require('./routes/store'));         // Store/inventory routes
// app.use('/api/doctors', require('./routes/doctors'));
// app.use('/api/patient_records', require('./routes/patient_records'));
// app.use('/api/ambulances', require('./routes/ambulances'));
// app.use('/api/blood', require('./routes/blood'));
// app.use('/api/rooms', require('./routes/rooms'));
// app.use('/api/notifications', require('./routes/notifications'));
// app.use('/api/working_hours', require('./routes/working_hours'));
// app.use('/api/support_tickets', require('./routes/support_tickets'));
// app.use('/api/chats', require('./routes/chats'));
// app.use('/api/emails', require('./routes/emails'));
// app.use('/api/reports', require('./routes/reports'));
app.use('/api/test-types', require('./routes/test-types'));
app.use('/api/conditions', require('./routes/conditions'));
app.use('/api/wards', require('./routes/wards'));
app.use('/api/staff', require('./routes/staff'));

// ===== ROOT ROUTE =====
// This is what people see when they visit the main URL (like http://localhost:5000/)
app.get('/', (req, res) => {
  res.send('🏥 ERP Backend Running');      // Send a simple message to show the server is working
});

// ===== START THE SERVER =====
// Only start the server if we're NOT running tests
// This prevents conflicts when running automated tests
if (process.env.NODE_ENV !== 'test' && process.env.JEST_WORKER_ID === undefined) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);  // Show a message when server starts
  });
}

// Export the app so other files (like tests) can use it
module.exports = app;
