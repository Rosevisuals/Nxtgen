const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockUsers = [
  { user_id: 1, full_Name: 'John Doe', email: 'john@example.com', phone: '1234567890', gender: 'M', DOB: '1980-01-01', marital_status: 'Single', Address: '123 Main St', status: 'active', created_at: '2023-01-01T00:00:00Z' },
  { user_id: 2, full_Name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', gender: 'F', DOB: '1985-05-05', marital_status: 'Married', Address: '456 Park Ave', status: 'active', created_at: '2023-01-02T00:00:00Z' }
];

const mockDb = {
  request: jest.fn(() => ({
    input: jest.fn().mockReturnThis(),
    query: jest.fn((sql) => {
      if (sql.includes('SELECT') && sql.includes('users')) {
        return Promise.resolve({ recordset: mockUsers });
      }
      if (sql.startsWith('SELECT * FROM users WHERE email = @email')) {
        return Promise.resolve({ recordset: [] });
      }
      if (sql.startsWith('INSERT')) {
        return Promise.resolve({ recordset: [{ user_id: 3, full_Name: 'Test User', email: 'testuser@example.com', phone: '1112223333', gender: 'M', DOB: '1990-01-01', marital_status: 'Single', Address: '789 Elm St', status: 'active', created_at: '2023-01-03T00:00:00Z' }], rowsAffected: [1] });
      }
      if (sql.startsWith('UPDATE')) {
        let updatedUser = { ...mockUsers[0] };
        mockDb.input.mock.calls.forEach(call => {
          if (call[0] === 'full_Name') updatedUser.full_Name = call[1];
          if (call[0] === 'email') updatedUser.email = call[1];
          if (call[0] === 'phone') updatedUser.phone = call[1];
          if (call[0] === 'gender') updatedUser.gender = call[1];
          if (call[0] === 'DOB') updatedUser.DOB = call[1];
          if (call[0] === 'marital_status') updatedUser.marital_status = call[1];
          if (call[0] === 'Address') updatedUser.Address = call[1];
          if (call[0] === 'status') updatedUser.status = call[1];
        });
        mockDb._updatedUser = updatedUser;
        return Promise.resolve({ rowsAffected: [1] });
      }
      if (sql.startsWith('DELETE')) {
        return Promise.resolve({ rowsAffected: [1] });
      }
      return Promise.resolve({ recordset: [] });
    }),
  })),
  input: jest.fn().mockReturnThis(),
  _updatedUser: null,
  _lastUserId: null
};

// Ensure the mock path matches the model import
jest.mock('../../config/db', () => ({
  poolConnect: Promise.resolve(),
  pool: mockDb,
  sql: {
    Int: jest.fn(),
    VarChar: jest.fn()
  }
}));

jest.mock('../../config/db');

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
      expect(response.body[0]).toHaveProperty('user_id');
      expect(response.body[0]).toHaveProperty('full_Name');
      expect(response.body[0]).toHaveProperty('gender');
      expect(response.body[0]).toHaveProperty('DOB');
      expect(response.body[0]).toHaveProperty('marital_status');
      expect(response.body[0]).toHaveProperty('Address');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('created_at');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200);
      expect(response.body).toHaveProperty('user_id', 1);
      expect(response.body).toHaveProperty('full_Name');
      expect(response.body).toHaveProperty('gender');
      expect(response.body).toHaveProperty('DOB');
      expect(response.body).toHaveProperty('marital_status');
      expect(response.body).toHaveProperty('Address');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('created_at');
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
        full_Name: 'Test User',
        email: 'testuser@example.com',
        phone: '1112223333',
        password: 'testpass',
        gender: 'M',
        DOB: '1990-01-01',
        marital_status: 'Single',
        Address: '789 Elm St',
        status: 'active'
      };
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).toHaveProperty('full_Name', newUser.full_Name);
      expect(response.body).toHaveProperty('gender', newUser.gender);
      expect(response.body).toHaveProperty('DOB', newUser.DOB);
      expect(response.body).toHaveProperty('marital_status', newUser.marital_status);
      expect(response.body).toHaveProperty('Address', newUser.Address);
      expect(response.body).toHaveProperty('status', newUser.status);
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
      const updateData = { full_Name: 'Updated Name' };
      // Explicitly set the updated user in the mock before the GET by id call
      mockDb._updatedUser = {
        ...mockDb._updatedUser,
        ...mockUsers[0],
        full_Name: updateData.full_Name
      };
      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);
      expect(response.body.full_Name).toBe(updateData.full_Name);
    });
  });
}); 