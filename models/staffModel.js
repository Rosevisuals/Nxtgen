const { poolConnect, pool, sql } = require('../config/db');

const createStaff = async ({
    full_Name,
    email,
    phone,
    password_hash,
    gender,
    DOB,
    marital_status,
    Address,
    status,
    specialization,
    biodata,
    head_department,
    license_number,
    role_id,
    department_id,
    created_at
}) => {
    await poolConnect;
    const transaction = new sql.Transaction(pool);
    try {
        const now = new Date();
        await transaction.begin();
        const userInsertResult = await transaction.request()
            .input('full_Name', sql.VarChar(50), full_Name)
            .input('email', sql.VarChar(100), email)
            .input('phone', sql.VarChar(20), phone)
            .input('password_hash', sql.VarChar(255), password_hash)
            .input('gender', sql.VarChar(5), gender)
            .input('DOB', sql.Date, DOB)
            .input('marital_status', sql.VarChar(25), marital_status)
            .input('Address', sql.VarChar(50), Address)
            .input('status', sql.VarChar(20), status || 'active')
            .input('created_at', sql.DateTime, new Date())
            .query('INSERT INTO users (full_Name, email, phone, password_hash, gender, DOB, marital_status, Address, status, created_at) OUTPUT INSERTED.user_id VALUES (@full_Name, @email, @phone, @password_hash, @gender, @DOB, @marital_status, @Address, @status, @created_at)');

        const user_id = userInsertResult.recordset[0].user_id;
        const insertResult = await transaction.request()
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
        await transaction.commit();
        return insertResult.recordset[0];
    }
    catch (err) {
        await transaction.rollback();
        throw err;
    }
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