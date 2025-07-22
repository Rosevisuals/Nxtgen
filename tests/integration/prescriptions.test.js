// tests/integration/prescriptions.test.js

const request = require('supertest');
const app = require('../../server');
const { pool, sql } = require('../../config/db');

describe('Prescriptions API', () => {
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

  it('should get all prescriptions', async () => {
    const res = await request(app)
      .get('/api/prescriptions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new prescription', async () => {
    const res = await request(app)
      .post('/api/prescriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patient_id: 1,
        doctor_id: 1,
        medication: 'Aspirin',
        dosage: '500mg',
        frequency: 'Once a day',
        start_date: '2025-07-22',
        end_date: '2025-07-29'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('prescription_id');
  });
});