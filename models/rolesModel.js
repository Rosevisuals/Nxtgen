const { sql, poolConnect, pool } = require('../config/db');

// Get all roles
const getAllRoles = async () => {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM roles');
  return result.recordset;
};

// Get a role by id
const getRoleById = async (role_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('role_id', sql.Int, role_id);
  const result = await request.query('SELECT * FROM roles WHERE role_id = @role_id');
  return result.recordset[0];
};

module.exports = {
  getAllRoles,
  getRoleById,
}; 