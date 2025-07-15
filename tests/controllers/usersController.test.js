const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockUsers = [
  { user_id: 1, full_name: 'John Doe', username: 'johndoe', email: 'john@example.com', phone: '1234567890', role_id: 2, role_name: 'Doctor', profile_picture: null, status: 'active' },
  { user_id: 2, full_name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', phone: '0987654321', role_id: 3, role_name: 'Nurse', profile_picture: null, status: 'active' }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    // Simulate user not found for id 999
    if (sql.includes('SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.role_id WHERE u.user_id = @user_id')) {
      if (mockDb._lastUserId === 999) {
        return Promise.resolve({ recordset: [] });
      }
      // For update, return the updated user if full_name was updated
      if (mockDb._updatedUser) {
        return Promise.resolve({ recordset: [mockDb._updatedUser] });
      }
      return Promise.resolve({ recordset: [mockUsers[0]] });
    }
    if (sql.includes('SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.role_id')) {
      return Promise.resolve({ recordset: mockUsers });
    }
    if (sql.startsWith('SELECT * FROM users WHERE username = @username OR email = @email')) {
      // Simulate no existing user for create test
      return Promise.resolve({ recordset: [] });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ user_id: 3, full_name: 'Test User', username: 'testuser', email: 'testuser@example.com', phone: '1112223333', role_id: 3, role_name: 'Nurse', profile_picture: null, status: 'active' }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      // Simulate update by storing the updated user
      const updateCall = mockDb.input.mock.calls;
      let updatedUser = { ...mockUsers[0] };
      for (const call of updateCall) {
        if (call[0] === 'full_name') updatedUser.full_name = call[1];
        if (call[0] === 'username') updatedUser.username = call[1];
        if (call[0] === 'email') updatedUser.email = call[1];
        if (call[0] === 'phone') updatedUser.phone = call[1];
        if (call[0] === 'role_id') updatedUser.role_id = call[1];
        if (call[0] === 'profile_picture') updatedUser.profile_picture = call[1];
        if (call[0] === 'status') updatedUser.status = call[1];
      }
      mockDb._updatedUser = updatedUser;
      return Promise.resolve({ rowsAffected: [1] });
    }
    if (sql.startsWith('DELETE')) {
      return Promise.resolve({ rowsAffected: [1] });
    }
    return Promise.resolve({ recordset: [] });
  }),
  _updatedUser: null,
  _lastUserId: null
};

jest.mock('../../config/db', () => ({
  poolConnect: Promise.resolve(),
  pool: mockDb,
  sql: {
    Int: jest.fn(),
    VarChar: jest.fn()
  }
}));

const usersController = require('../../controllers/usersController');

const app = express();
app.use(express.json());
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:id', usersController.getUserById);
app.post('/api/users', usersController.createUser);
app.put('/api/users/:id', usersController.updateUser);

describe('Users Controller', () => {
  beforeEach(() => {
    mockDb._updatedUser = null;
    mockDb.input.mockClear();
  });
  afterEach(() => {
    mockDb.input.mockClear();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('role_id');
      expect(response.body[0]).toHaveProperty('role_name');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200);
      expect(response.body).toHaveProperty('user_id', 1);
      expect(response.body).toHaveProperty('role_id');
      expect(response.body).toHaveProperty('role_name');
    });
    it('should return 404 for non-existent user', async () => {
      // Set up the mock to simulate user_id 999 not found
      mockDb.input.mockImplementation(function (key, value) {
        if (key === 'user_id') mockDb._lastUserId = value;
        return this;
      });
      mockDb._lastUserId = 999;
      await request(app)
        .get('/api/users/999')
        .expect(404);
      // Reset input mock
      mockDb.input.mockImplementation(function () { return this; });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        full_name: 'Test User',
        username: 'testuser',
        email: 'testuser@example.com',
        phone: '1112223333',
        password: 'testpass',
        role_id: 3,
        profile_picture: null,
        status: 'active'
      };
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).toHaveProperty('role_id', 3);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/users')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const updateData = { full_name: 'Updated Name' };
      // Explicitly set the updated user in the mock before the GET by id call
      mockDb._updatedUser = {
        ...mockDb._updatedUser,
        ...mockUsers[0],
        full_name: updateData.full_name
      };
      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);
      expect(response.body.full_name).toBe(updateData.full_name);
    });
  });
}); 