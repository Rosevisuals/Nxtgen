const request = require('supertest');
const express = require('express');

// Mock DB methods
const mockWards = [
  { id: 1, name: 'General Ward', capacity: 20 },
  { id: 2, name: 'ICU', capacity: 5 }
];

const mockDb = {
  request: jest.fn().mockReturnThis(),
  input: jest.fn().mockReturnThis(),
  query: jest.fn((sql) => {
    if (sql.includes('SELECT * FROM wards WHERE ward_id = @ward_id')) {
      const lastInput = mockDb.input.mock.calls[mockDb.input.mock.calls.length - 1];
      if (lastInput && lastInput[1] === 999) {
        return Promise.resolve({ recordset: [] });
      }
      return Promise.resolve({ recordset: [{ ward_id: 1, name: 'General Ward', capacity: 20 }] });
    }
    if (sql.includes('SELECT') && sql.includes('FROM wards')) {
      return Promise.resolve({ recordset: mockWards });
    }
    if (sql.startsWith('INSERT')) {
      return Promise.resolve({ 
        recordset: [{ ward_id: 3, name: 'General Ward', capacity: 20 }],
        rowsAffected: [1] 
      });
    }
    if (sql.startsWith('UPDATE')) {
      return Promise.resolve({ 
        recordset: [{ ward_id: 1, name: 'General Ward', capacity: 30 }],
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
    VarChar: jest.fn()
  }
}));

const wardController = require('../../controllers/wardController');

const app = express();
app.use(express.json());
app.get('/api/wards', wardController.getAllWards);
app.get('/api/wards/:id', wardController.getWardById);
app.post('/api/wards', wardController.createWard);
app.put('/api/wards/:id', wardController.updateWard);

describe('Ward Controller', () => {
  describe('GET /api/wards', () => {
    it('should return all wards', async () => {
      const response = await request(app)
        .get('/api/wards')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/wards/:id', () => {
    it('should return a specific ward', async () => {
      const response = await request(app)
        .get('/api/wards/1')
        .expect(200);
      expect(response.body).toHaveProperty('ward_id', 1);
    });
    it('should return 404 for non-existent ward', async () => {
      await request(app)
        .get('/api/wards/999')
        .expect(404);
    });
  });

  describe('POST /api/wards', () => {
    it('should create a new ward', async () => {
      const newWard = {
        name: 'General Ward',
        capacity: 20
      };
      const response = await request(app)
        .post('/api/wards')
        .send(newWard)
        .expect(201);
      expect(response.body).toHaveProperty('ward_id');
      expect(response.body.name).toBe(newWard.name);
    });
    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/wards')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/wards/:id', () => {
    it('should update an existing ward', async () => {
      const updateData = { capacity: 30 };
      const response = await request(app)
        .put('/api/wards/1')
        .send(updateData)
        .expect(200);
      expect(response.body.capacity).toBe(updateData.capacity);
    });
  });
}); 