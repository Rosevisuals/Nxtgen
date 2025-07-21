const { sql, pool, poolConnect } = require('../__mocks__/mock-staff-db');

const createStaff = async (staff) => {
  await poolConnect;

  const request = pool.request();
  request.input('user_id', sql.Int, staff.user_id);
  request.input('specialization', sql.VarChar(30), staff.specialization);
  request.input('biodata', sql.VarChar(20), staff.biodata);
  request.input('head_department', sql.VarChar(15), staff.head_department);
  request.input('license_number', sql.VarChar(20), staff.license_number);
  request.input('role_id', sql.Int, staff.role_id);
  request.input('department_id', sql.Int, staff.department_id);
  request.input('created_at', sql.DateTime, staff.created_at);

  const result = await request.query(`
    INSERT INTO staff (user_id, specialization, biodata, head_department, license_number, role_id, department_id, created_at)
    VALUES (@user_id, @specialization, @biodata, @head_department, @license_number, @role_id, @department_id, @created_at);
    SELECT SCOPE_IDENTITY() AS staff_id;
    `);

  const staff_id = result.recordset[0].staff_id;
  const staffResult = await pool.request().input('staff_id', sql.Int, staff_id)
    .query('SELECT * FROM staff WHERE staff_id = @staff_id');

  return staffResult.recordset[0];
};

const deleteStaff = async (staff_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('staff_id', sql.Int, staff_id);
  await request.query('DELETE FROM staff WHERE staff_id = @staff_id');
  return true;
};

const getAllStaff = async () => {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM staff');
  return result.recordset;
};

const getStaffById = async (staff_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('staff_id', sql.Int, staff_id);
  const result = await request.query(`
    SELECT s.*, u.full_name AS user_name, u.email, u.phone, dept.name AS department_name
    FROM staff s
    JOIN users u ON s.user_id = u.user_id
    JOIN departments dept ON s.department_id = dept.department_id
    WHERE s.staff_id = @staff_id
  `);
  return result.recordset[0];
};

const updateStaff = async (staff_id, updates) => {
  await poolConnect;
  const fields = [];

  const request = pool.request();
  if (updates.specialization) { request.input('specialization', sql.VarChar(30), updates.specialization); fields.push('specialization = @specialization'); }
  if (updates.biodata) { request.input('biodata', sql.VarChar(20), updates.biodata); fields.push('biodata = @biodata'); }
  if (updates.head_department) { request.input('head_department', sql.VarChar(15), updates.head_department); fields.push('head_department = @head_department'); }
  if (updates.license_number) { request.input('license_number', sql.VarChar(15), updates.license_number); fields.push('license_number = @license_number'); }
  if (updates.role_id) { request.input('role_id', sql.Int, updates.role_id); fields.push('role_id = @role_id'); }
  if (updates.department_id) { request.input('department_id', sql.Int, updates.department_id); fields.push('department_id = @department_id'); }
  if (fields.length === 0) return null;
  request.input('staff_id', sql.Int, staff_id);

  const result = await request.query(`
    UPDATE staff SET ${fields.join(', ')} WHERE staff_id = @staff_id;
    SELECT * FROM staff WHERE staff_id = @staff_id;
  `);

  return result.recordset[0];
};

module.exports = {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffById,
  updateStaff
};