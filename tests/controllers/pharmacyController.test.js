const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockPharmacy = [
  { id: 1, name: 'Paracetamol', quantity: 100, price: 5.0 },
  { id: 2, name: 'Ibuprofen', quantity: 50, price: 10.0 }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM pharmacy WHERE pharmacy_id = @pharmacy_id')) {
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ pharmacy_id: 1, name: 'Paracetamol', quantity: 100, price: 5.0 }] });
    }
    if (sql.includes('SELECT * FROM pharmacy')) {
      return Promise.resolve({ recordset: mockPharmacy });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ pharmacy_id: 3, name: 'Paracetamol', quantity: 100, price: 5.0 }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ pharmacy_id: 1, name: 'Paracetamol', quantity: 200, price: 5.0 }],
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
    Decimal: jest.fn(),
    Text: jest.fn()
  }
}));

const pharmacyController = require('../../controllers/pharmacyController');

const app = express();
app.use(express.json());
app.get('/api/pharmacy', pharmacyController.getAllPharmacyItems);
app.get('/api/pharmacy/:id', pharmacyController.getPharmacyItemById);
app.post('/api/pharmacy', pharmacyController.createPharmacyItem);
app.put('/api/pharmacy/:id', pharmacyController.updatePharmacyItem);

describe('Pharmacy Controller', () => {
  describe('GET /api/pharmacy', () => {
    it('should return all pharmacy items', async () => {
      const response = await request(app)
        .get('/api/pharmacy')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/pharmacy/:id', () => {
    it('should return a specific pharmacy item', async () => {
      const response = await request(app)
        .get('/api/pharmacy/1')
        .expect(200);
      expect(response.body).toHaveProperty('pharmacy_id', 1);
    });
    it('should return 404 for non-existent pharmacy item', async () => {
      await request(app)
        .get('/api/pharmacy/999')
        .expect(404);
    });
  });

  describe('POST /api/pharmacy', () => {
    it('should create a new pharmacy item', async () => {
      const newItem = {
        name: 'Paracetamol',
        quantity: 100,
        price: 5.0
      };
      const response = await request(app)
        .post('/api/pharmacy')
        .send(newItem)
        .expect(201);
      expect(response.body).toHaveProperty('pharmacy_id');
      expect(response.body.name).toBe(newItem.name);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/pharmacy')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/pharmacy/:id', () => {
    it('should update an existing pharmacy item', async () => {
      const updateData = { quantity: 200 };
      const response = await request(app)
        .put('/api/pharmacy/1')
        .send(updateData)
        .expect(200);
      expect(response.body.quantity).toBe(updateData.quantity);
    });
  });
}); 