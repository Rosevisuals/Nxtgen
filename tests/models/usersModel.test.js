jest.mock('../../config/db', () => require('../../__mocks__/db.js'));
const usersModel = require('../../models/usersModel');

describe('usersModel direct unit tests', () => {
  test('getAllUsers returns an array of users', async () => {
    const users = await usersModel.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('user_id');
    expect(users[0]).toHaveProperty('full_Name');
  });

  test('getUserById returns a user for valid id', async () => {
    const user = await usersModel.getUserById(1);
    expect(user).toBeDefined();
    expect(user.user_id).toBe(1);
    expect(user).toHaveProperty('full_Name');
  });

  test('getUserById returns undefined for invalid id', async () => {
    const user = await usersModel.getUserById(999);
    expect(user).toBeUndefined();
  });

  test('createUser adds a new user and returns its id', async () => {
    const newUser = {
      full_Name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '5551234567',
      password_hash: 'hashedpassword',
      gender: 'Female',
      DOB: '1992-02-02',
      marital_status: 'Married',
      Address: '456 Side St',
      status: 'Active',
      created_at: new Date().toISOString()
    };
    const result = await usersModel.createUser(newUser);
    expect(result).toHaveProperty('user_id');
    // Now check that the user is in the list
    const users = await usersModel.getAllUsers();
    const found = users.find(u => u.email === newUser.email);
    expect(found).toBeDefined();
    expect(found.full_Name).toBe('Jane Smith');
  });
}); 