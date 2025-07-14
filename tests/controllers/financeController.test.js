const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockFinance = [
  { id: 1, patientId: 1, amount: 1000, type: 'payment', date: '2024-02-01' },
  { id: 2, patientId: 2, amount: 500, type: 'refund', date: '2024-02-02' }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM finance WHERE transaction_id = @transaction_id')) {
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ transaction_id: 1, amount: 1000, type: 'payment', date: '2024-02-01', patient_id: 1 }] });
    }
    if (sql.includes('SELECT') && sql.includes('FROM finance')) {
      return Promise.resolve({ recordset: mockFinance });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ transaction_id: 3, amount: 1000, type: 'payment', date: '2024-02-01', patient_id: 1 }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ transaction_id: 1, amount: 2000, type: 'payment', date: '2024-02-01', patient_id: 1 }],
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
    Decimal: jest.fn()
  }
}));

const financeController = require('../../controllers/financeController');

const app = express();
app.use(express.json());
app.get('/api/finance', financeController.getAllFinanceRecords);
app.get('/api/finance/:id', financeController.getFinanceRecordById);
app.post('/api/finance', financeController.createFinanceRecord);
app.put('/api/finance/:id', financeController.updateFinanceRecord);


describe('Finance Controller', () => {
  describe('GET /api/finance', () => {
    it('should return all finance records', async () => {
      const response = await request(app)
        .get('/api/finance')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/finance/:id', () => {
    it('should return a specific finance record', async () => {
      const response = await request(app)
        .get('/api/finance/1')
        .expect(200);
      expect(response.body).toHaveProperty('transaction_id', 1);
    });
    it('should return 404 for non-existent finance record', async () => {
      await request(app)
        .get('/api/finance/999')
        .expect(404);
    });
  });

  describe('POST /api/finance', () => {
    it('should create a new finance record', async () => {
      const newRecord = {
        patient_id: 1,
        amount: 1000,
        cashier_id: 1
      };
      const response = await request(app)
        .post('/api/finance')
        .send(newRecord)
        .expect(201);
      expect(response.body).toHaveProperty('transaction_id');
      expect(response.body.amount).toBe(newRecord.amount);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/finance')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/finance/:id', () => {
    it('should update an existing finance record', async () => {
      const updateData = { amount: 2000 };
      const response = await request(app)
        .put('/api/finance/1')
        .send(updateData)
        .expect(200);
      expect(response.body.amount).toBe(updateData.amount);
    });
  });
}); 