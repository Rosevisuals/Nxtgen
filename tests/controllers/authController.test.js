const request = require('supertest');
const express = require('express');

// Mock bcrypt and jwt
jest.mock('bcrypt', () => ({
  hash: jest.fn((pw) => Promise.resolve('hashed_' + pw)),
  compare: jest.fn((pw, hash) => Promise.resolve(hash === 'hashed_' + pw))
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
  verify: jest.fn(() => ({ id: 1, email: 'john@example.com', role: 'doctor' }))
}));

// Mock DB methods
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: 'hashed_password123', role: 'doctor' }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM users WHERE email = @email')) {
      return Promise.resolve({ recordset: [mockUsers[0]] });
    }
    if (sql.startsWith('INSERT')) {
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

const authController = require('../../controllers/authController');

const app = express();
app.use(express.json());
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);

describe('Auth Controller', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: 'password123' })
        .expect(200);
      expect(response.body).toHaveProperty('token');
    });
    it('should fail with invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: 'wrongpass' })
        .expect(401);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'securepass',
        role: 'doctor'
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: '', password: '' })
        .expect(400);
    });
  });
}); 