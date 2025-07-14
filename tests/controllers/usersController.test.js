const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'doctor' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'nurse' }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM users WHERE user_id = @user_id')) {
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ user_id: 1, name: 'John Doe', email: 'john@example.com', role: 'doctor' }] });
    }
    if (sql.includes('SELECT * FROM users')) {
      return Promise.resolve({ recordset: mockUsers });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ user_id: 3, name: 'Test User', email: 'testuser@example.com', role: 'nurse' }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ user_id: 1, name: 'Updated Name', email: 'john@example.com', role: 'doctor' }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('DELETE')) {
      return Promise.resolve({ rowsAffected: [1] });
    }
    return Promise.resolve({ recordset: [] });
  })
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
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200);
      expect(response.body).toHaveProperty('user_id', 1);
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
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpass',
        role: 'nurse'
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
      const updateData = { name: 'Updated Name' };
      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);
      expect(response.body.name).toBe(updateData.name);
    });
  });
}); 