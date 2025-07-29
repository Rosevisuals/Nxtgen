const { poolConnect, pool, sql } = require('../config/db');

const createStaff = async ({
    user_id,
    specialization,
    biodata,
    head_department,
    license_number,
    role_id,
    department_id,
    created_at
}) => {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('specialization', sql.VarChar(30), specialization)
        .input('biodata', sql.VarChar(20), biodata)
        .input('head_department', sql.VarChar(15), head_department)
        .input('license_number', sql.VarChar(20), license_number)
        .input('role_id', sql.Int, role_id)
        .input('department_id', sql.Int, department_id)
        .input('created_at', sql.DateTime, created_at ?? now)
        .query(`INSERT INTO staff (
        user_id, 
        specialization, 
        biodata, 
        head_department, 
        license_number, 
        role_id,
        department_id,
        created_at)
        OUTPUT INSERTED.* VALUES (
        @user_id, 
        @specialization, 
        @biodata, 
        @head_department, 
        @license_number, 
        @role_id, 
        @department_id, 
        @created_at)`);
    return insertResult.recordset[0];
}

const deleteStaff = async (id) => {
    await poolConnect;
    await pool.request()
        .input('staff_id', sql.Int, id)
        .query('DELETE FROM staff WHERE staff_id = @staff_id');
}

const getAllStaff = async () => {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT s.*, u.full_Name AS user_name, u.email, u.phone, dept.name AS department_name
      FROM staff s
      JOIN users u ON s.user_id = u.user_id
      JOIN departments dept ON s.department_id = dept.department_id
    `);
    return result.recordset;
}

const getStaffById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('staff_id', sql.Int, id)
        .query(`SELECT s.*, u.full_Name AS user_name, u.email, u.phone, dept.name AS department_name
        FROM staff s
        JOIN users u ON s.user_id = u.user_id
        JOIN departments dept ON s.department_id = dept.department_id
        WHERE s.staff_id = @staff_id`);
    return result.recordset[0];
}

const updateStaff = async (id, { specialization, biodata, head_department, license_number, role_id, department_id }) => {
    await poolConnect;
    const fields = [];

    if (specialization) fields.push('specialization = @specialization');
    if (biodata) fields.push('biodata = @biodata');
    if (head_department) fields.push('head_department = @head_department');
    if (license_number) fields.push('license_number = @license_number');
    if (role_id) fields.push('role_id = @role_id');
    if (department_id) fields.push('department_id = @department_id');
    if (fields.length === 0) return null;
    const updateQuery = `UPDATE staff SET ${fields.join(', ')} WHERE staff_id = @staff_id`;

    const request = pool.request().input('staff_id', sql.Int, id);
    if (specialization) request.input('specialization', sql.VarChar(30), specialization);
    if (biodata) request.input('biodata', sql.VarChar(20), biodata);
    if (head_department) request.input('head_department', sql.VarChar(15), head_department);
    if (license_number) request.input('license_number', sql.VarChar(20), license_number);
    if (role_id) request.input('role_id', sql.Int, role_id);
    if (department_id) request.input('department_id', sql.Int, department_id);
    await request.query(updateQuery);

    const result = await pool.request()
        .input('staff_id', sql.Int, id)
        .query(`SELECT s.*, u.full_Name AS user_name, u.email, u.phone, dept.name AS department_name
              FROM staff s
              JOIN users u ON s.user_id = u.user_id
              JOIN departments dept ON s.department_id = dept.department_id
              WHERE s.staff_id = @staff_id`);

    return result.recordset[0];
}

module.exports = {
    createStaff,
    deleteStaff,
    getAllStaff,
    getStaffById,
    updateStaff
}