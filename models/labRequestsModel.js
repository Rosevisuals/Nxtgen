const { poolConnect, pool, sql } = require('../config/db');

const createLabRequest = async ({ patient_id, doctor_id, test_id, technician_id, date_conducted, notes, results }) => {
    await poolConnect;
    const insertResult = await pool.request()
        .input('patient_id', sql.Int, patient_id)
        .input('doctor_id', sql.Int, doctor_id)
        .input('test_id', sql.Int, test_id)
        .input('technician_id', sql.Int, technician_id)
        .input('date_conducted', sql.DateTime, date_conducted)
        .input('notes', sql.VarChar(25), notes)
        .input('results', sql.VarChar(100), results)
        .query(`INSERT INTO labrequests (patient_id, doctor_id, test_id, technician_id, date_conducted, notes, results)
        OUTPUT INSERTED.* VALUES (@patient_id, @doctor_id, @test_id, @technician_id, @date_conducted, @notes, @results)`);
    return insertResult.recordset[0];
}

const deleteLabRequest = async (id) => {
    await poolConnect;
    await pool.request()
        .input('labrequest_id', sql.Int, id)
        .query('DELETE FROM labrequests WHERE labrequest_id = @labrequest_id');
}

const getAllLabRequests = async () => {
    await poolConnect;
    const result = await pool.request().query(`
        SELECT lr.*, 
               p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               ds.user_id as doctor_user_id, du.full_Name as doctor_name, ds.specialization as doctor_specialization,
               ts.user_id as technician_user_id, tu.full_Name as technician_name, ts.specialization as technician_specialization,
               tt.Name_of_test
        FROM labrequests lr
        JOIN patients p ON lr.patient_id = p.patient_id
        JOIN users pu ON p.user_id = pu.user_id
        JOIN staff ds ON lr.doctor_id = ds.staff_id
        JOIN users du ON ds.user_id = du.user_id
        LEFT JOIN staff ts ON lr.technician_id = ts.staff_id
        LEFT JOIN users tu ON ts.user_id = tu.user_id
        JOIN testtype tt ON lr.test_id = tt.test_id
        ORDER BY lr.date_conducted DESC
    `);
    return result.recordset;
}

const getLabRequestById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('labrequest_id', sql.Int, id)
        .query(`
            SELECT lr.*, 
                   p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
                   ds.user_id as doctor_user_id, du.full_Name as doctor_name, ds.specialization as doctor_specialization,
                   ts.user_id as technician_user_id, tu.full_Name as technician_name, ts.specialization as technician_specialization,
                   tt.Name_of_test
            FROM labrequests lr
            JOIN patients p ON lr.patient_id = p.patient_id
            JOIN users pu ON p.user_id = pu.user_id
            JOIN staff ds ON lr.doctor_id = ds.staff_id
            JOIN users du ON ds.user_id = du.user_id
            LEFT JOIN staff ts ON lr.technician_id = ts.staff_id
            LEFT JOIN users tu ON ts.user_id = tu.user_id
            JOIN testtype tt ON lr.test_id = tt.test_id
            WHERE lr.labrequest_id = @labrequest_id
        `);
    return result.recordset[0];
}

const updateLabRequest = async (id, { patient_id, doctor_id, test_id, technician_id, date_conducted, notes, results }) => {
    await poolConnect;
    const request = pool.request();
    const fields = [];

    if (patient_id) {
        fields.push('patient_id = @patient_id');
        request.input('patient_id', sql.Int, patient_id);
    }
    if (doctor_id) {
        fields.push('doctor_id = @doctor_id');
        request.input('doctor_id', sql.Int, doctor_id);
    }
    if (test_id) {
        fields.push('test_id = @test_id');
        request.input('test_id', sql.Int, test_id);
    }
    if (technician_id) {
        fields.push('technician_id = @technician_id');
        request.input('technician_id', sql.Int, technician_id);
    }
    if (date_conducted) {
        fields.push('date_conducted = @date_conducted');
        request.input('date_conducted', sql.DateTime, date_conducted);
    }
    if (notes) {
        fields.push('notes = @notes');
        request.input('notes', sql.VarChar(30), notes);
    }
    if (results) {
        fields.push('results = @results');
        request.input('results', sql.VarChar(30), results);
    }
    if (fields.length === 0) return null;
    const updateQuery = `UPDATE labrequests SET ${fields.join(', ')} WHERE labrequest_id = @labrequest_id`;

    request.input('labrequest_id', sql.Int, id);
    await request.query(updateQuery);

    const result = await pool.request()
        .input('labrequest_id', sql.Int, id)
        .query(`SELECT * FROM labrequests WHERE labrequest_id = @labrequest_id`);

    return result.recordset[0];
}

module.exports = {
    createLabRequest,
    deleteLabRequest,
    getAllLabRequests,
    getLabRequestById,
    updateLabRequest
}