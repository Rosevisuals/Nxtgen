// tests/integration/billing.test.js

const request = require('supertest');
const app = require('../../server');
const { pool, sql } = require('../../config/db');

describe('Billing API', () => {
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

  it('should get all bills', async () => {
    const res = await request(app)
      .get('/api/billing')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new bill', async () => {
    const res = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patient_id: 1,
        amount: 100.50,
        status: 'unpaid',
        due_date: '2025-12-31'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('bill_id');
  });
});