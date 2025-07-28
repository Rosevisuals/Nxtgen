const { poolConnect, pool, sql } = require('../config/db');

const createCondition = async ({ Name, Description, Status }) => {
    await poolConnect;
    const insertResult = await pool.request()
        .input('Name', sql.VarChar(100), Name)
        .input('Description', sql.Text, Description)
        .input('Status', sql.VarChar(50), Status)
        .query(`INSERT INTO Conditions (Name, Description, Status)
        OUTPUT INSERTED.* VALUES (@Name, @Description, @Status)`);
    return insertResult.recordset[0];
}

const deleteCondition = async (id) => {
    await poolConnect;
    await pool.request()
        .input('ConditionID', sql.Int, id)
        .query('DELETE FROM Conditions WHERE ConditionID = @ConditionID');
}

const getAllConditions = async () => {
    await poolConnect;
    const result = await pool.request().query(`SELECT * FROM Conditions`);
    return result.recordset;
}

const getConditionById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('ConditionID', sql.Int, id)
        .query(`SELECT * FROM Conditions WHERE ConditionID = @ConditionID`);
    return result.recordset[0];
}

const updateCondition = async (id, { Name, Description, Status }) => {
    await poolConnect;
    const fields = [];

    if (Name) fields.push('Name = @Name');
    if (Description) fields.push('Description = @Description');
    if (Status) fields.push('Status = @Status');
    if (fields.length === 0) return null;
    const updateQuery = `UPDATE Conditions SET ${fields.join(', ')} WHERE ConditionID = @ConditionID`;

    const request = pool.request().input('ConditionID', sql.Int, id);
    if (Name) request.input('Name', sql.VarChar(100), Name);
    if (Description) request.input('Description', sql.Text, Description);
    if (Status) request.input('Status', sql.VarChar(50), Status);
    await request.query(updateQuery);

    const result = await pool.request()
        .input('ConditionID', sql.Int, id)
        .query(`SELECT * FROM Conditions WHERE ConditionID = @ConditionID`);

    return result.recordset[0];
}

module.exports = {
    createCondition,
    deleteCondition,
    getAllConditions,
    getConditionById,
    updateCondition
}