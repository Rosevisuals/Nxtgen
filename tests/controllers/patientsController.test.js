const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockPatients = [
  { id: 1, name: 'Patient A', age: 30, condition: 'stable' },
  { id: 2, name: 'Patient B', age: 45, condition: 'critical' }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM patients WHERE patient_id = @patient_id')) {
      // Check if the last input was for ID 999
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ patient_id: 1, full_name: 'Patient A', date_of_birth: '1990-01-01', gender: 'Male', phone_number: '1234567890', address: 'Test Address', doctor_id: 1 }] });
    }
    if (sql.includes('SELECT * FROM patients')) {
      return Promise.resolve({ recordset: mockPatients });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ patient_id: 3, full_name: 'Test Patient', date_of_birth: '1990-01-01', gender: 'Male', phone_number: '1234567890', address: 'Test Address', doctor_id: 1 }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ patient_id: 1, full_name: 'Updated Patient', date_of_birth: '1990-01-01', gender: 'Male', phone_number: '1234567890', address: 'Updated Address', doctor_id: 1 }],
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
    VarChar: jest.fn(),
    Date: jest.fn(),
    Text: jest.fn()
  }
}));

const patientsController = require('../../controllers/patientsController');

const app = express();
app.use(express.json());
app.get('/api/patients', patientsController.getAllPatients);
app.get('/api/patients/:id', patientsController.getPatientById);
app.post('/api/patients', patientsController.createPatient);
app.put('/api/patients/:id', patientsController.updatePatient);
app.delete('/api/patients/:id', patientsController.deletePatient);

describe('Patients Controller', () => {
  let app;
  let mockDb;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Setup routes for testing
    app.get('/api/patients', patientsController.getAllPatients);
    app.get('/api/patients/:id', patientsController.getPatientById);
    app.post('/api/patients', patientsController.createPatient);
    app.put('/api/patients/:id', patientsController.updatePatient);
    app.delete('/api/patients/:id', patientsController.deletePatient);
    
    // Reset mock database
    mockDb = mockDb;
  });

  describe('GET /api/patients', () => {
    it('should return all patients', async () => {
      const response = await request(app)
        .get('/api/patients')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return a specific patient', async () => {
      const response = await request(app)
        .get('/api/patients/1')
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body.patient_id).toBe(1);
    });
    it('should return 404 for non-existent patient', async () => {
      await request(app)
        .get('/api/patients/999')
        .expect(404);
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const newPatient = {
        full_name: 'Test Patient',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        phone_number: '1234567890',
        address: 'Test Address',
        doctor_id: 1
      };
      const response = await request(app)
        .post('/api/patients')
        .send(newPatient)
        .expect(201);
      expect(response.body).toBeDefined();
      expect(response.body.patient_id).toBeDefined();
      expect(response.body.full_name).toBe(newPatient.full_name);
    });
    it('should return 400 for invalid data', async () => {
      const invalidPatient = {
        full_name: '', // Invalid: empty name
        date_of_birth: '1990-01-01',
        gender: 'Male',
        phone_number: '1234567890',
        doctor_id: 1
      };
      await request(app)
        .post('/api/patients')
        .send(invalidPatient)
        .expect(400);
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('should update an existing patient', async () => {
      const updateData = { 
        full_name: 'Updated Patient',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        phone_number: '1234567890',
        address: 'Updated Address',
        doctor_id: 1
      };
      const response = await request(app)
        .put('/api/patients/1')
        .send(updateData)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body.full_name).toBe(updateData.full_name);
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('should delete a patient', async () => {
      await request(app)
        .delete('/api/patients/1')
        .expect(200);
    });
  });
}); 