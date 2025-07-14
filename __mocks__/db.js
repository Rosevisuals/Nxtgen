// __mocks__/db.js - Mock Database for Testing
// This file creates a fake database that we use during testing
// Instead of connecting to a real database, we use this to simulate database operations
// This allows us to test our code without needing a real database running

// ===== MOCK DATA =====
// This is fake data that simulates what would be in a real database
// In a real database, this data would be stored in tables
const mockData = {
  // Fake users table
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'doctor' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'nurse' }
  ],
  // Fake patients table
  patients: [
    { id: 1, name: 'Patient A', age: 30, condition: 'stable' },
    { id: 2, name: 'Patient B', age: 45, condition: 'critical' }
  ],
  // Fake appointments table
  appointments: [
    { id: 1, patientId: 1, doctorId: 1, date: '2024-01-15', time: '10:00' },
    { id: 2, patientId: 2, doctorId: 1, date: '2024-01-15', time: '14:00' }
  ]
};

// ===== MOCK DATABASE CLASS =====
// This class simulates a real database with methods like query, findOne, etc.
class MockDatabase {
  constructor() {
    // Create a deep copy of the mock data so each test gets fresh data
    // This prevents tests from interfering with each other
    this.data = JSON.parse(JSON.stringify(mockData));
  }

  // ===== GENERIC QUERY METHOD =====
  // This simulates running SQL queries on the database
  async query(sql, params = []) {
    // Simulate a small delay like a real database would have
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Simple mock implementation - you can expand this based on your actual DB queries
    // This checks what type of query it is and returns appropriate data
    if (sql.includes('SELECT')) {
      if (sql.includes('users')) {
        return { rows: this.data.users };
      } else if (sql.includes('patients')) {
        return { rows: this.data.patients };
      } else if (sql.includes('appointments')) {
        return { rows: this.data.appointments };
      }
    }
    
    // If no matching query is found, return empty results
    return { rows: [] };
  }

  // ===== FIND ONE RECORD =====
  // This method finds a single record that matches certain conditions
  // Example: findOne('users', { email: 'john@example.com' })
  async findOne(table, conditions) {
    const items = this.data[table] || [];
    return items.find(item => 
      // Check if ALL the conditions match
      Object.keys(conditions).every(key => item[key] === conditions[key])
    );
  }

  // ===== FIND ALL RECORDS =====
  // This method finds all records that match certain conditions
  // If no conditions are provided, it returns all records
  async findAll(table, conditions = {}) {
    const items = this.data[table] || [];
    if (Object.keys(conditions).length === 0) {
      return items;  // Return all items if no conditions
    }
    return items.filter(item => 
      // Check if ALL the conditions match
      Object.keys(conditions).every(key => item[key] === conditions[key])
    );
  }

  // ===== INSERT NEW RECORD =====
  // This method adds a new record to the specified table
  async insert(table, data) {
    // Generate a new ID (find the highest existing ID and add 1)
    const newId = Math.max(...this.data[table].map(item => item.id)) + 1;
    const newItem = { id: newId, ...data };
    this.data[table].push(newItem);
    return newItem;
  }

  // ===== UPDATE EXISTING RECORD =====
  // This method updates an existing record by ID
  async update(table, id, data) {
    const index = this.data[table].findIndex(item => item.id === id);
    if (index !== -1) {
      // Merge the existing data with the new data
      this.data[table][index] = { ...this.data[table][index], ...data };
      return this.data[table][index];
    }
    return null;  // Return null if record not found
  }

  // ===== DELETE RECORD =====
  // This method removes a record from the specified table
  async delete(table, id) {
    const index = this.data[table].findIndex(item => item.id === id);
    if (index !== -1) {
      // Remove the item and return it
      const deleted = this.data[table].splice(index, 1)[0];
      return deleted;
    }
    return null;  // Return null if record not found
  }

  // ===== RESET DATA =====
  // This method resets the data back to the original state
  // Useful for cleaning up between tests
  reset() {
    this.data = JSON.parse(JSON.stringify(mockData));
  }
}

// Export the MockDatabase class so tests can use it
module.exports = MockDatabase; 