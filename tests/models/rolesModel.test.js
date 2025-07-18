jest.mock('../../config/db', () => require('../../__mocks__/db.js'));
const rolesModel = require('../../models/rolesModel');


describe('rolesModel', () => {
  beforeEach(() => {
    // Reset mock DB roles for each test if needed
    const db = require('../../config/db');
    db.pool.request().query = jest.fn((sql) => {
      if (/select \* from roles/i.test(sql)) {
        return Promise.resolve({ recordset: [
          { role_id: 1, role_name: 'Admin', description: 'System Administrator' },
          { role_id: 2, role_name: 'Doctor', description: 'Medical practitioner' },
          { role_id: 3, role_name: 'Nurse', description: 'Assists doctors and cares for patients' }
        ] });
      }
      if (/select \* from roles where role_id/i.test(sql)) {
        return Promise.resolve({ recordset: [
          { role_id: 2, role_name: 'Doctor', description: 'Medical practitioner' }
        ] });
      }
      return Promise.resolve({ recordset: [] });
    });
  });

  it('should get all roles', async () => {
    const roles = await rolesModel.getAllRoles();
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThan(0);
    expect(roles[0]).toHaveProperty('role_id');
    expect(roles[0]).toHaveProperty('role_name');
  });

  it('should get a role by id', async () => {
    const role = await rolesModel.getRoleById(2);
    expect(role).toBeDefined();
    expect(role.role_id).toBe(2);
    expect(role.role_name).toBe('Doctor');
  });

  it('should return undefined for non-existent role', async () => {
    const db = require('../../config/db');
    db.pool.request().query = jest.fn(() => Promise.resolve({ recordset: [] }));
    const role = await rolesModel.getRoleById(999);
    expect(role).toBeUndefined();
  });
}); 