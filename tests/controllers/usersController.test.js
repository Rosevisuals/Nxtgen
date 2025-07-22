const request = require('supertest');
const express = require('express');

// Mock DB methods
let mockUsers = [];

const mockDb = {
  _inputs: {},
  request: jest.fn(function() {
    this._inputs = {}; // Reset inputs for each request
    return {
      input: jest.fn((key, value) => {
        this._inputs[key] = value;
        return this;
      }).mockReturnThis(),
      query: jest.fn((query) => {
        if (query.startsWith('SELECT * FROM users WHERE user_id = @user_id')) {
          const user = mockUsers.find(u => u.user_id === this._inputs.user_id);
          return Promise.resolve({ recordset: user ? [user] : [] });
        }
        if (query.startsWith('SELECT * FROM users WHERE email = @email')) {
          const user = mockUsers.find(u => u.email === this._inputs.email);
          return Promise.resolve({ recordset: user ? [user] : [] });
        }
        if (query.startsWith('SELECT * FROM users')) {
          return Promise.resolve({ recordset: mockUsers });
        }
        if (query.startsWith('INSERT')) {
          const newUser = {
            user_id: mockUsers.length + 1,
            ...this._inputs
          };
          mockUsers.push(newUser);
          return Promise.resolve({ recordset: [{ user_id: newUser.user_id }] });
        }
        if (query.startsWith('UPDATE')) {
          const userIndex = mockUsers.findIndex(u => u.user_id === this._inputs.user_id);
          if (userIndex > -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...this._inputs };
          }
          return Promise.resolve({ recordset: [mockUsers[userIndex]] });
        }
        if (query.startsWith('DELETE')) {
          mockUsers = mockUsers.filter(u => u.user_id !== this._inputs.user_id);
          return Promise.resolve({ rowsAffected: [1] });
        }
        return Promise.resolve({ recordset: [] });
      }),
    };
  })
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
    // Reset mock users before each test
    mockUsers = [
      { user_id: 1, full_Name: 'John Doe', email: 'john@example.com', phone: '1234567890', gender: 'M', DOB: '1980-01-01', marital_status: 'Single', Address: '123 Main St', status: 'active', created_at: '2023-01-01T00:00:00Z' },
      { user_id: 2, full_Name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', gender: 'F', DOB: '1985-05-05', marital_status: 'Married', Address: '456 Park Ave', status: 'active', created_at: '2023-01-02T00:00:00Z' }
    ];
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
      await request(app)
        .get('/api/users/999')
        .expect(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        full_Name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword',
      };
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('user_id');
      expect(response.body.email).toBe(newUser.email);
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
      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);
      expect(response.body.full_Name).toBe(updateData.full_Name);
      expect(response.body.user_id).toBe(1);
    });
  });
}); 