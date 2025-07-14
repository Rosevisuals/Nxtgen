const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockConsultations = [
  { id: 1, doctor_id: 1, patient_id: 1, diagnosis: 'Flu', notes: 'Routine', prescribed_meds: 'Paracetamol', request_admission: 0, request_lab_test: 0 },
  { id: 2, doctor_id: 2, patient_id: 2, diagnosis: 'Cold', notes: 'Mild', prescribed_meds: 'Ibuprofen', request_admission: 0, request_lab_test: 0 }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM consultations WHERE consultation_id = @consultation_id')) {
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ consultation_id: 1, notes: 'Routine', diagnosis: 'Flu', doctor_id: 1, patient_id: 1, appointment_id: 1 }] });
    }
    if (sql.includes('SELECT * FROM consultations')) {
      return Promise.resolve({ recordset: mockConsultations });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ consultation_id: 3, notes: 'Routine checkup', diagnosis: 'Test Diagnosis', doctor_id: 1, patient_id: 1, appointment_id: 1 }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ consultation_id: 1, notes: 'Updated notes', diagnosis: 'Updated Diagnosis', doctor_id: 1, patient_id: 1, appointment_id: 1 }],
        rowsAffected: [1] 
      });
    }
    return Promise.resolve({ recordset: [] });
  })
};

jest.mock('../../config/db', () => ({
  poolConnect: Promise.resolve(),
  pool: mockDb,
  sql: {
    Int: jest.fn(),
    VarChar: jest.fn(),
    Date: jest.fn(),
    Text: jest.fn(),
    Bit: jest.fn()
  }
}));

const consultationController = require('../../controllers/consultationController');

const app = express();
app.use(express.json());
app.get('/api/consultations', consultationController.getAllConsultations);
app.get('/api/consultations/:id', consultationController.getConsultationById);
app.post('/api/consultations', consultationController.createConsultation);
app.put('/api/consultations/:id', consultationController.updateConsultation);

describe('Consultation Controller', () => {
  describe('GET /api/consultations', () => {
    it('should return all consultations', async () => {
      const response = await request(app)
        .get('/api/consultations')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/consultations/:id', () => {
    it('should return a specific consultation', async () => {
      const response = await request(app)
        .get('/api/consultations/1')
        .expect(200);
      expect(response.body).toHaveProperty('consultation_id', 1);
    });
    it('should return 404 for non-existent consultation', async () => {
      await request(app)
        .get('/api/consultations/999')
        .expect(404);
    });
  });

  describe('POST /api/consultations', () => {
    it('should create a new consultation', async () => {
      const newConsultation = {
        doctor_id: 1,
        patient_id: 1,
        appointment_id: 1,
        diagnosis: 'Test Diagnosis',
        notes: 'Routine checkup'
      };
      const response = await request(app)
        .post('/api/consultations')
        .send(newConsultation)
        .expect(201);
      expect(response.body).toHaveProperty('consultation_id');
      expect(response.body.notes).toBe(newConsultation.notes);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/consultations')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/consultations/:id', () => {
    it('should update an existing consultation', async () => {
      const updateData = { notes: 'Updated notes' };
      const response = await request(app)
        .put('/api/consultations/1')
        .send(updateData)
        .expect(200);
      expect(response.body.notes).toBe(updateData.notes);
    });
  });
}); 