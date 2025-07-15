// __mocks__/db.js - Mock Database for Testing
// This file creates a fake database that we use during testing
// Instead of connecting to a real database, we use this to simulate database operations
// This allows us to test our code without needing a real database running

// ===== MOCK DATA =====
// This is fake data that simulates what would be in a real database
// In a real database, this data would be stored in tables
const mockData = {
  // Fake roles table
  roles: [
    { role_id: 1, role_name: 'Admin', description: 'System Administrator' },
    { role_id: 2, role_name: 'Doctor', description: 'Medical practitioner' },
    { role_id: 3, role_name: 'Nurse', description: 'Assists doctors and cares for patients' }
  ],
  // Fake users table
  users: [
    {
      user_id: 1,
      full_name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '1234567890',
      password_hash: 'hashed_password123',
      role_id: 2,
      profile_picture: null,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      user_id: 2,
      full_name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      phone: '0987654321',
      password_hash: 'hashed_password456',
      role_id: 3,
      profile_picture: null,
      status: 'active',
      created_at: '2024-01-01T00:00:00Z'
    }
  ],
  // Fake patients table
  patients: [
    {
      patient_id: 1,
      full_name: 'Patient A',
      date_of_birth: '1990-01-01',
      gender: 'Male',
      phone_number: '1234567890',
      address: '123 Main St',
      doctor_id: 1
    },
    {
      patient_id: 2,
      full_name: 'Patient B',
      date_of_birth: '1985-05-15',
      gender: 'Female',
      phone_number: '0987654321',
      address: '456 Elm St',
      doctor_id: 1
    }
  ],
  // Fake appointments table
  appointments: [
    {
      appointment_id: 1,
      patient_id: 1,
      doctor_id: 1,
      appointment_date: '2024-01-15',
      appointment_time: '10:00',
      status: 'scheduled',
      notes: 'Initial consultation'
    },
    {
      appointment_id: 2,
      patient_id: 2,
      doctor_id: 1,
      appointment_date: '2024-01-15',
      appointment_time: '14:00',
      status: 'scheduled',
      notes: 'Follow-up visit'
    }
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

  // Simulate a join with roles when returning users
  _withRoleName(user) {
    const role = this.data.roles.find(r => r.role_id === user.role_id);
    return { ...user, role_name: role ? role.role_name : null };
  }

  // ===== GENERIC QUERY METHOD =====
  // This simulates running SQL queries on the database
  async query(sql, params = []) {
    // Simulate a small delay like a real database would have
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Simple mock implementation - you can expand this based on your actual DB queries
    // This checks what type of query it is and returns appropriate data
    if (sql.includes('SELECT') && sql.includes('users')) {
      // Simulate join with roles
      return { rows: this.data.users.map(u => this._withRoleName(u)) };
    }
    if (sql.includes('SELECT') && sql.includes('roles')) {
      return { rows: this.data.roles };
    }
    if (sql.includes('SELECT')) {
      if (sql.includes('patients')) {
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
    const found = items.find(item => 
      // Check if ALL the conditions match
      Object.keys(conditions).every(key => item[key] === conditions[key])
    );
    if (table === 'users' && found) {
      return this._withRoleName(found);
    }
    return found;
  }

  // ===== FIND ALL RECORDS =====
  // This method finds all records that match certain conditions
  // If no conditions are provided, it returns all records
  async findAll(table, conditions = {}) {
    const items = this.data[table] || [];
    let results = items;
    if (Object.keys(conditions).length > 0) {
      results = items.filter(item => 
        // Check if ALL the conditions match
        Object.keys(conditions).every(key => item[key] === conditions[key])
      );
    }
    if (table === 'users') {
      return results.map(u => this._withRoleName(u));
    }
    return results;
  }

  // ===== INSERT NEW RECORD =====
  // This method adds a new record to the specified table
  async insert(table, data) {
    // Generate a new ID (find the highest existing ID and add 1)
    if (table === 'users') {
      const newId = Math.max(...this.data.users.map(item => item.user_id)) + 1;
      const newItem = { user_id: newId, ...data };
      this.data.users.push(newItem);
      return this._withRoleName(newItem);
    }
    const newId = Math.max(...this.data[table].map(item => item.id)) + 1;
    const newItem = { id: newId, ...data };
    this.data[table].push(newItem);
    return newItem;
  }

  // ===== UPDATE EXISTING RECORD =====
  // This method updates an existing record by ID
  async update(table, id, data) {
    if (table === 'users') {
      const index = this.data.users.findIndex(item => item.user_id === id);
      if (index !== -1) {
        // Merge the existing data with the new data
        this.data.users[index] = { ...this.data.users[index], ...data };
        return this._withRoleName(this.data.users[index]);
      }
      return null;  // Return null if record not found
    }
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
    if (table === 'users') {
      const index = this.data.users.findIndex(item => item.user_id === id);
      if (index !== -1) {
        // Remove the item and return it
        const deleted = this.data.users.splice(index, 1)[0];
        return this._withRoleName(deleted);
      }
      return null;  // Return null if record not found
    }
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