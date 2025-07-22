// tests/integration/departments.test.js

const request = require('supertest');
const app = require('../../server');
const { pool, sql } = require('../../config/db');

describe('Departments API', () => {
  let token;

  beforeAll(async () => {
    // Login to get a token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  it('should get all departments', async () => {
    const res = await request(app)
      .get('/api/departments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new department', async () => {
    const res = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        department_name: 'Cardiology'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('department_id');
  });
});