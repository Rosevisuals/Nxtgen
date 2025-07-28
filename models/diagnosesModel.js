const { poolConnect, pool, sql } = require('../config/db');

const createDiagnosis = async ({
    patient_id,
    doctor_id,
    ConditionID,
    Symptoms,
    DiagnosisNote,
    DiagnosisDate,
    requestdate
}) => {
    await poolConnect;
    const insertResult = await pool.request()
        .input('patient_id', sql.Int, patient_id)
        .input('doctor_id', sql.Int, doctor_id)
        .input('ConditionID', sql.Int, ConditionID)
        .input('Symptoms', sql.Text, Symptoms)
        .input('DiagnosisNote', sql.Text, DiagnosisNote)
        .input('DiagnosisDate', sql.DateTime, DiagnosisDate)
        .input('requestdate', sql.DateTime, requestdate)
        .query(`INSERT INTO Diagnosis (patient_id, doctor_id, ConditionID, Symptoms, DiagnosisNote, DiagnosisDate, requestdate)
        OUTPUT INSERTED.* VALUES (@patient_id, @doctor_id, @ConditionID, @Symptoms, @DiagnosisNote, @DiagnosisDate, @requestdate)`);
    return insertResult.recordset[0];
}

const deleteDiagnosis = async (id) => {
    await poolConnect;
    await pool.request()
        .input('DiagnosisID', sql.Int, id)
        .query('DELETE FROM Diagnosis WHERE DiagnosisID = @DiagnosisID');
}

const getAllDiagnoses = async () => {
    await poolConnect;
    const result = await pool.request().query(`SELECT * FROM Diagnosis`);
    return result.recordset;
}

const getDiagnosisById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('DiagnosisID', sql.Int, id)
        .query(`SELECT * FROM Diagnosis WHERE DiagnosisID = @DiagnosisID`);
    return result.recordset[0];
}

const updateDiagnosis = async (id, {
    patient_id,
    doctor_id,
    ConditionID,
    Symptoms,
    DiagnosisNote,
    DiagnosisDate,
    requestdate
}) => {
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
    if (ConditionID) {
        fields.push('ConditionID = @ConditionID');
        request.input('ConditionID', sql.Int, ConditionID);
    }
    if (Symptoms) {
        fields.push('Symptoms = @Symptoms');
        request.input('Symptoms', sql.Text, Symptoms);
    }
    if (DiagnosisNote) {
        fields.push('DiagnosisNote = @DiagnosisNote');
        request.input('DiagnosisNote', sql.Text, DiagnosisNote);
    }
    if (DiagnosisDate) {
        fields.push('DiagnosisDate = @DiagnosisDate');
        request.input('DiagnosisDate', sql.DateTime, DiagnosisDate);
    }
    if (requestdate) {
        fields.push('requestdate = @requestdate');
        request.input('requestdate', sql.DateTime, requestdate);
    }
    if (fields.length === 0) return null;
    const updateQuery = `UPDATE Diagnosis SET ${fields.join(', ')} WHERE DiagnosisID = @DiagnosisID`;

    request.input('DiagnosisID', sql.Int, id);
    await request.query(updateQuery);

    const result = await pool.request()
        .input('DiagnosisID', sql.Int, id)
        .query(`SELECT * FROM Diagnosis WHERE DiagnosisID = @DiagnosisID`);

    return result.recordset[0];
}

module.exports = {
    createDiagnosis,
    deleteDiagnosis,
    getAllDiagnoses,
    getDiagnosisById,
    updateDiagnosis
}