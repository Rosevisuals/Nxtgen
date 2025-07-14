// tests/helpers/testAppointmentsStore.js - Test Appointments Storage Helper
// This file provides a simple file-based storage system for appointments during testing
// Instead of using a database, it saves appointment data to a JSON file
// This helps with integration tests where we need data to persist between requests

// Import required Node.js modules
const fs = require('fs');        // File system module for reading/writing files
const path = require('path');    // Path module for handling file paths

// Define the path where we'll store the appointments data
// This creates a file called 'appointments.json' in the same directory as this file
const STORE_PATH = path.join(__dirname, 'appointments.json');

// ===== READ APPOINTMENTS FUNCTION =====
// This function reads all appointments from the JSON file
function readAppointments() {
  // Check if the file exists
  if (!fs.existsSync(STORE_PATH)) {
    return [];  // Return empty array if file doesn't exist
  }
  
  // Read the file and parse the JSON data
  // 'utf8' tells Node.js to read the file as text
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

// ===== WRITE APPOINTMENTS FUNCTION =====
// This function saves appointments to the JSON file
function writeAppointments(appointments) {
  // Convert the appointments array to JSON string
  // The second parameter (null, 2) adds nice formatting with 2-space indentation
  fs.writeFileSync(STORE_PATH, JSON.stringify(appointments, null, 2), 'utf8');
}

// ===== CLEAR APPOINTMENTS FUNCTION =====
// This function deletes the appointments file
// Useful for cleaning up between tests
function clearAppointments() {
  // Check if file exists before trying to delete it
  if (fs.existsSync(STORE_PATH)) {
    fs.unlinkSync(STORE_PATH);  // Delete the file
  }
}

// ===== EXPORT FUNCTIONS =====
// Export all the functions so they can be used in test files
module.exports = {
  readAppointments,    // Function to read appointments from file
  writeAppointments,   // Function to save appointments to file
  clearAppointments,   // Function to delete the appointments file
  STORE_PATH          // The path to the appointments file (useful for debugging)
}; 