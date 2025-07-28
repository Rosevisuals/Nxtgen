const { poolConnect, pool, sql } = require('../config/db');

const createTestType = async ({ Name_of_test }) => {
    await poolConnect;
    const insertResult = await pool.request()
        .input('Name_of_test', sql.VarChar(25), Name_of_test)
        .query(`INSERT INTO testtype (Name_of_test)
        OUTPUT INSERTED.* VALUES (@Name_of_test)`);
    return insertResult.recordset[0];
}

const deleteTestType = async (id) => {
    await poolConnect;
    await pool.request()
        .input('test_id', sql.Int, id)
        .query('DELETE FROM testtype WHERE test_id = @test_id');
}

const getAllTestType = async () => {
    await poolConnect;
    const result = await pool.request().query(`SELECT * FROM testtype`);
    return result.recordset;
}

const getTestTypeById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('test_id', sql.Int, id)
        .query(`SELECT * FROM testtype WHERE test_id = @test_id`);
    return result.recordset[0];
}

const updateTestType = async (id, { Name_of_test }) => {
    await poolConnect;
    const fields = [];

    if (Name_of_test) fields.push('Name_of_test = @Name_of_test');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE testtype SET ${fields.join(', ')} WHERE test_id = @test_id`;

    const request = pool.request().input('test_id', sql.Int, id);
    if (Name_of_test) request.input('Name_of_test', sql.VarChar(30), Name_of_test);
    await request.query(updateQuery);

    const result = await pool.request()
        .input('test_id', sql.Int, id)
        .query(`SELECT * FROM testtype WHERE test_id = @test_id`);

    return result.recordset[0];
}

module.exports = {
    createTestType,
    deleteTestType,
    getAllTestType,
    getTestTypeById,
    updateTestType
}