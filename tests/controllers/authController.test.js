// tests/controllers/authController.test.js
const { login } = require('../../controllers/authController');
const usersModel = require('../../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/usersModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authController login (unit)', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: 'john@example.com', password: 'password123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    usersModel.getUserByEmail.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
  });

  it('should login with valid credentials', async () => {
    usersModel.getUserByEmail.mockResolvedValue({
      user_id: 1,
      full_Name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashed_password123',
      status: 'active'
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked.jwt.token');

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'mocked.jwt.token',
      user: expect.objectContaining({
        user_id: 1,
        full_Name: 'John Doe',
        email: 'john@example.com'
      })
    }));
  });

  it('should fail with invalid password', async () => {
    usersModel.getUserByEmail.mockResolvedValue({
      user_id: 1,
      full_Name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashed_password123',
      status: 'active'
    });
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
  });

  it('should fail if user not found', async () => {
    usersModel.getUserByEmail.mockResolvedValue(undefined);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should fail if user is not active', async () => {
    usersModel.getUserByEmail.mockResolvedValue({
      user_id: 1,
      full_Name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashed_password123',
      status: 'inactive'
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'User is not active' });
  });
}); 