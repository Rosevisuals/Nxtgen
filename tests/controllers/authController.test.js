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
  { user_id: 1, full_name: 'John Doe', username: 'johndoe', email: 'john@example.com', phone: '1234567890', password_hash: 'hashed_password123', role_id: 2, role_name: 'Doctor', profile_picture: null, status: 'active' }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT u.*, r.role_name FROM users u LEFT JOIN roles r ON u.role_id = r.role_id WHERE u.email = @email')) {
      return Promise.resolve({ recordset: [mockUsers[0]] });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ recordset: [{ user_id: 2, full_name: 'New User', username: 'newuser', email: 'newuser@example.com', phone: '2223334444', role_id: 2, role_name: 'Doctor', profile_picture: null, status: 'active' }] });
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
      expect(response.body.user).toHaveProperty('user_id', 1);
      expect(response.body.user).toHaveProperty('role_id', 2);
      expect(response.body.user).toHaveProperty('role_name', 'Doctor');
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
        full_name: 'New User',
        username: 'newuser',
        email: 'newuser@example.com',
        phone: '2223334444',
        password: 'securepass',
        role_id: 2,
        profile_picture: null,
        status: 'active'
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);
      expect(response.body).toHaveProperty('user_id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).toHaveProperty('role_id', 2);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: '', password: '' })
        .expect(400);
    });
  });
}); 