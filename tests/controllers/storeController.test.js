const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockStore = [
  { id: 1, name: 'Bandage', quantity: 50, price: 2.5 },
  { id: 2, name: 'Gloves', quantity: 200, price: 1.0 }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM stores WHERE store_id = @store_id')) {
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ store_id: 1, name: 'Bandage', quantity: 50, price: 2.5 }] });
    }
    if (sql.includes('SELECT') && sql.includes('FROM stores')) {
      return Promise.resolve({ recordset: mockStore });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ store_id: 3, name: 'Bandage', quantity: 50, price: 2.5 }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ store_id: 1, name: 'Bandage', quantity: 100, price: 2.5 }],
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

const storeController = require('../../controllers/storeController');

const app = express();
app.use(express.json());
app.get('/api/store', storeController.getAllStoreItems);
app.get('/api/store/:id', storeController.getStoreItemById);
app.post('/api/store', storeController.createStoreItem);
app.put('/api/store/:id', storeController.updateStoreItem);

describe('Store Controller', () => {
  describe('GET /api/store', () => {
    it('should return all store items', async () => {
      const response = await request(app)
        .get('/api/store')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/store/:id', () => {
    it('should return a specific store item', async () => {
      const response = await request(app)
        .get('/api/store/1')
        .expect(200);
      expect(response.body).toHaveProperty('store_id', 1);
    });
    it('should return 404 for non-existent store item', async () => {
      await request(app)
        .get('/api/store/999')
        .expect(404);
    });
  });

  describe('POST /api/store', () => {
    it('should create a new store item', async () => {
      const newItem = {
        name: 'Bandage',
        quantity: 50,
        price: 2.5
      };
      const response = await request(app)
        .post('/api/store')
        .send(newItem)
        .expect(201);
      expect(response.body).toHaveProperty('store_id');
      expect(response.body.name).toBe(newItem.name);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/store')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/store/:id', () => {
    it('should update an existing store item', async () => {
      const updateData = { quantity: 100 };
      const response = await request(app)
        .put('/api/store/1')
        .send(updateData)
        .expect(200);
      expect(response.body.quantity).toBe(updateData.quantity);
    });
  });
}); 