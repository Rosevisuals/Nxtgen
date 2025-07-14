// tests/setup.js - Test Setup Configuration
// This file runs before all tests to set up the testing environment
// Think of this as the "preparation room" that gets everything ready for testing

// Import the test configuration file
const testConfig = require('../config/test');

// ===== SET TEST ENVIRONMENT =====
// Tell the application that we're running in test mode
// This affects how the application behaves (e.g., uses mock database instead of real database)
process.env.NODE_ENV = 'test';

// ===== GLOBAL TEST UTILITIES =====
// Make the test configuration available to all test files
// This allows tests to access test-specific settings
global.testConfig = testConfig;

// ===== MOCK CONSOLE METHODS =====
// Replace console methods (log, debug, etc.) with mock functions during tests
// This reduces noise in test output and prevents console messages from cluttering the test results
global.console = {
  ...console,        // Keep the original console methods
  log: jest.fn(),    // Replace console.log with a mock function
  debug: jest.fn(),  // Replace console.debug with a mock function
  info: jest.fn(),   // Replace console.info with a mock function
  warn: jest.fn(),   // Replace console.warn with a mock function
  error: jest.fn(),  // Replace console.error with a mock function
};

// ===== SET TEST TIMEOUT =====
// Increase the timeout for async operations during tests
// Some operations (like database queries) might take longer than the default timeout
jest.setTimeout(10000);  // 10 seconds timeout instead of the default 5 seconds 