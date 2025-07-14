const request = require('supertest');
const express = require('express');
const { clearAppointments } = require('../helpers/testAppointmentsStore');

// Mock JWT for integration tests
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked.jwt.token'),
  verify: jest.fn(() => ({ user_id: 1, email: 'john@example.com', role: 'doctor' }))
}));

// Mock database
jest.mock('../../config/db', () => ({
  getConnection: () => new (require('../../__mocks__/db'))()
}));

// Import your app (you'll need to export it from server.js)
const app = require('../../server');

let authToken;

beforeAll(async () => {
  // Get auth token for protected routes
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'john@example.com',
      password: 'password123'
    });
  authToken = loginResponse.body.token;
});

beforeEach(() => {
  clearAppointments();
});

describe('Appointments API Integration', () => {
  it('should create, read, update, and delete appointments in one test', async () => {
    // 1. Create appointment
    const newAppointment = {
      patientId: 1,
      doctorId: 1,
      date: '2024-02-01',
      time: '10:00',
      type: 'consultation'
    };

    const createResponse = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newAppointment)
      .expect(201);

    const appointmentId = createResponse.body.id;
    expect(createResponse.body.patientId).toBe(newAppointment.patientId);

    // 2. Read appointment
    const getResponse = await request(app)
      .get(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(getResponse.body.id).toBe(appointmentId);

    // 3. Update appointment
    const updateData = {
      time: '11:00',
      notes: 'Rescheduled appointment'
    };

    const updateResponse = await request(app)
      .put(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(updateResponse.body.time).toBe(updateData.time);

    // 4. Delete appointment
    await request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // 5. Verify deletion
    await request(app)
      .get(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});

  describe('Appointment Validation', () => {
    it('should validate appointment data', async () => {
      const invalidAppointment = {
        patientId: 'invalid', // Should be number
        date: 'invalid-date', // Should be valid date
        time: '' // Should not be empty
      };

      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidAppointment)
        .expect(400);
    });
  });

  describe('Appointment Scheduling Conflicts', () => {
    it('should prevent double booking', async () => {
      const appointment1 = {
        patientId: 1,
        doctorId: 1,
        date: '2024-02-01',
        time: '10:00'
      };

      const appointment2 = {
        patientId: 2,
        doctorId: 1, // Same doctor
        date: '2024-02-01', // Same date
        time: '10:00' // Same time
      };

      // Create first appointment
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointment1)
        .expect(201);

      // Try to create conflicting appointment
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointment2)
        .expect(409); // Conflict status
    });
  });
