const { sql, poolConnect } = require('../config/db');
// const { sql, pool, poolConnect } = require('../__mocks__/db');// for testing so remember to change it back to the original file

// USERS MODEL: ERP4 SCHEMA
// Fields: user_id, full_Name, email, phone, password_hash, gender, DOB, marital_status, Address, status, created_at

const createUser = async (user) => {
  await poolConnect;
  const request = pool.request();
  request.input('full_Name', sql.VarChar(50), user.full_Name);
  request.input('email', sql.VarChar(100), user.email);
  request.input('phone', sql.VarChar(20), user.phone);
  request.input('password_hash', sql.VarChar(255), user.password_hash);
  request.input('gender', sql.VarChar(5), user.gender);
  request.input('DOB', sql.Date, user.DOB);
  request.input('marital_status', sql.VarChar(25), user.marital_status);
  request.input('Address', sql.VarChar(50), user.Address);
  request.input('status', sql.VarChar(20), user.status);
  request.input('created_at', sql.DateTime, user.created_at);
  const result = await request.query(`
    INSERT INTO users (full_Name, email, phone, password_hash, gender, DOB, marital_status, Address, status, created_at)
    VALUES (@full_Name, @email, @phone, @password_hash, @gender, @DOB, @marital_status, @Address, @status, @created_at);
    SELECT SCOPE_IDENTITY() AS user_id;
  `);
  const user_id = result.recordset[0].user_id;
  // Fetch the full user object
  const userResult = await pool.request().input('user_id', sql.Int, user_id)
    .query('SELECT * FROM users WHERE user_id = @user_id');
  return userResult.recordset[0];
};

const getUserById = async (user_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('user_id', sql.Int, user_id);
  const result = await request.query('SELECT * FROM users WHERE user_id = @user_id');
  return result.recordset[0];
};

const getUserByEmail = async (email) => {
  await poolConnect;
  const request = pool.request();
  request.input('email', sql.VarChar(100), email);
  const result = await request.query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

const updateUser = async (user_id, updates) => {
  await poolConnect;
  const request = pool.request();
  // Only update provided fields
  const fields = [];
  if (updates.full_Name) { request.input('full_Name', sql.VarChar(50), updates.full_Name); fields.push('full_Name = @full_Name'); }
  if (updates.email) { request.input('email', sql.VarChar(100), updates.email); fields.push('email = @email'); }
  if (updates.phone) { request.input('phone', sql.VarChar(20), updates.phone); fields.push('phone = @phone'); }
  if (updates.password_hash) { request.input('password_hash', sql.VarChar(255), updates.password_hash); fields.push('password_hash = @password_hash'); }
  if (updates.gender) { request.input('gender', sql.VarChar(5), updates.gender); fields.push('gender = @gender'); }
  if (updates.DOB) { request.input('DOB', sql.Date, updates.DOB); fields.push('DOB = @DOB'); }
  if (updates.marital_status) { request.input('marital_status', sql.VarChar(25), updates.marital_status); fields.push('marital_status = @marital_status'); }
  if (updates.Address) { request.input('Address', sql.VarChar(50), updates.Address); fields.push('Address = @Address'); }
  if (updates.status) { request.input('status', sql.VarChar(20), updates.status); fields.push('status = @status'); }
  if (fields.length === 0) return null;
  request.input('user_id', sql.Int, user_id);
  const result = await request.query(`
    UPDATE users SET ${fields.join(', ')} WHERE user_id = @user_id;
    SELECT * FROM users WHERE user_id = @user_id;
  `);
  return result.recordset[0];
};

const deleteUser = async (user_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('user_id', sql.Int, user_id);
  await request.query('DELETE FROM users WHERE user_id = @user_id');
  return true;
};

const getAllUsers = async () => {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM users');
  return result.recordset;
};

// Fetch staff role by user_id
const getStaffRoleByUserId = async (user_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('user_id', sql.Int, user_id);
  // Join staff and roles to get the role name for this user
  const result = await request.query(`
    SELECT r.role_name
    FROM staff s
    JOIN roles r ON s.role_id = r.role_id
    WHERE s.user_id = @user_id
  `);
  return result.recordset[0]?.role_name || null;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
  getStaffRoleByUserId, // export the new function
}; 