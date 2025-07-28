const { poolConnect, pool, sql } = require('../config/db');

const createBed = async ({
    patient_id,
    bed_number,
    status,
    ward_id }) => {
    await poolConnect;
    const insertResult = await pool.request()
        .input('patient_id', sql.Int, patient_id)
        .input('bed_number', sql.Int, bed_number)
        .input('status', sql.VarChar(15), status)
        .input('ward_id', sql.Int, ward_id)
        .query(`INSERT INTO beds (patient_id, bed_number, status, ward_id)
        OUTPUT INSERTED.* VALUES (@patient_id, @bed_number, @status, @ward_id)`);
    return insertResult.recordset[0];
}

const deleteBed = async (id) => {
    await poolConnect;
    await pool.request()
        .input('bed_id', sql.Int, id)
        .query('DELETE FROM beds WHERE bed_id = @bed_id');
}

const getAllBeds = async () => {
    await poolConnect;
    const result = await pool.request().query(`SELECT * FROM beds`);
    return result.recordset;
}

const getBedById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('bed_id', sql.Int, id)
        .query(`SELECT * FROM beds WHERE bed_id = @bed_id`);
    return result.recordset[0];
}

const updateBed = async (id, {
    patient_id,
    bed_number,
    status,
    ward_id }) => {
    await poolConnect;
    const fields = [];

    if (patient_id) fields.push('patient_id = @patient_id');
    if (bed_number) fields.push('bed_number = @bed_number');
    if (status) fields.push('status = @status');
    if (ward_id) fields.push('ward_id = @ward_id');
    if (fields.length === 0) return null;
    const updateQuery = `UPDATE beds SET ${fields.join(', ')} WHERE bed_id = @bed_id`;

    const request = pool.request().input('bed_id', sql.Int, id);
    if (patient_id) request.input('patient_id', sql.Int, patient_id);
    if (bed_number) request.input('bed_number', sql.Int, bed_number);
    if (status) request.input('status', sql.VarChar(50), status);
    if (ward_id) request.input('ward_id', sql.Int, ward_id);
    await request.query(updateQuery);

    const result = await pool.request()
        .input('bed_id', sql.Int, id)
        .query(`SELECT * FROM beds WHERE bed_id = @bed_id`);

    return result.recordset[0];
}

module.exports = {
    createBed,
    deleteBed,
    getAllBeds,
    getBedById,
    updateBed
}