const { poolConnect, pool, sql } = require('../config/db');

const createLabRequest = async ({ patient_id, doctor_id, test_id, technician_id, date_conducted, notes, results }) => {
    await poolConnect;
    const insertResult = await pool.request()
        .input('patient_id', sql.Int, patient_id)
        .input('doctor_id', sql.Int, doctor_id)
        .input('test_id', sql.Int, test_id)
        .input('technician_id', sql.Int, technician_id)
        .input('date_conducted', sql.Date, date_conducted)
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
    const result = await pool.request().query(`SELECT * FROM labrequests`);
    return result.recordset;
}

const getLabRequestById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('labrequest_id', sql.Int, id)
        .query(`SELECT * FROM labrequests WHERE labrequest_id = @labrequest_id`);
    return result.recordset[0];
}

const updateLabRequest = async (id, { patient_id, doctor_id, test_id, technician_id, date_conducted, notes, results }) => {
    await poolConnect;
    const fields = [];

    if (patient_id) fields.push('patient_id = @patient_id');
    if (doctor_id) fields.push('doctor_id = @doctor_id');
    if (test_id) fields.push('test_id = @test_id');
    if (technician_id) fields.push('technician_id = @technician_id');
    if (date_conducted) fields.push('date_conducted = @date_conducted');
    if (notes) fields.push('notes = @notes');
    if (results) fields.push('results = @results');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE labrequests SET ${fields.join(', ')} WHERE labrequest_id = @labrequest_id`;

    const request = pool.request().input('labrequest_id', sql.Int, id);
    // if (Name_of_test) request.input('Name_of_test', sql.VarChar(30), Name_of_test);
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