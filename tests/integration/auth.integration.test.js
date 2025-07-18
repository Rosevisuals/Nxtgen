const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');
const { authenticateToken, authorizeRoles } = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Mock JWT secret for tests
process.env.JWT_SECRET = 'testsecret';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Example protected route (staff only)
app.get('/api/protected/staff', authenticateToken, authorizeRoles(['Doctor', 'Admin']), (req, res) => {
  res.json({ message: 'Staff access granted', user: req.user });
});

describe('Auth Integration', () => {
  let staffToken, userToken;

  beforeAll(() => {
    // Create a valid staff JWT
    staffToken = jwt.sign({ user_id: 1, email: 'staff@example.com', role: 'Doctor' }, process.env.JWT_SECRET);
    // Create a valid non-staff JWT
    userToken = jwt.sign({ user_id: 2, email: 'user@example.com' }, process.env.JWT_SECRET);
  });

  it('should allow staff with correct role', async () => {
    const res = await request(app)
      .get('/api/protected/staff')
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Staff access granted');
    expect(res.body.user).toHaveProperty('role', 'Doctor');
  });

  it('should deny access to non-staff user', async () => {
    const res = await request(app)
      .get('/api/protected/staff')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
    expect(res.body).toHaveProperty('message', expect.stringContaining('Insufficient permissions'));
  });

  it('should deny access with no token', async () => {
    await request(app)
      .get('/api/protected/staff')
      .expect(401);
  });
}); 