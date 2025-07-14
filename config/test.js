// config/test.js - Test Configuration
// This file contains settings specifically for running tests
// Think of this as the "test mode settings" that tell the app how to behave during testing

// Import the mock database class
const MockDatabase = require('../__mocks__/db');

// ===== TEST CONFIGURATION OBJECT =====
// This object contains all the settings needed for testing
const testConfig = {
  // Database configuration for tests
  database: {
    // Use mock database for testing instead of real database
    // This allows us to test without needing a real database connection
    getConnection: () => new MockDatabase(),
    // You can also mock specific database methods here if needed
  },
  // Other test-specific configurations
  port: 3001,           // Use a different port for tests to avoid conflicts
  environment: 'test'   // Mark this as test environment
};

// Export the test configuration so other files can use it
module.exports = testConfig; 