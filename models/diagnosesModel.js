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
    const result = await pool.request().query(`
        SELECT d.*, 
               p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               s.user_id as doctor_user_id, su.full_Name as doctor_name, s.specialization, s.license_number,
               c.Name as condition_name, c.Description as condition_description, c.Status as condition_status
        FROM Diagnosis d
        JOIN patients p ON d.patient_id = p.patient_id
        JOIN users pu ON p.user_id = pu.user_id
        JOIN staff s ON d.doctor_id = s.staff_id
        JOIN users su ON s.user_id = su.user_id
        LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
        ORDER BY d.DiagnosisDate DESC
    `);
    return result.recordset;
}

const getDiagnosisById = async (id) => {
    await poolConnect;
    const result = await pool.request()
        .input('DiagnosisID', sql.Int, id)
        .query(`
            SELECT d.*, 
                   p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
                   s.user_id as doctor_user_id, su.full_Name as doctor_name, s.specialization, s.license_number,
                   c.Name as condition_name, c.Description as condition_description, c.Status as condition_status
            FROM Diagnosis d
            JOIN patients p ON d.patient_id = p.patient_id
            JOIN users pu ON p.user_id = pu.user_id
            JOIN staff s ON d.doctor_id = s.staff_id
            JOIN users su ON s.user_id = su.user_id
            LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
            WHERE d.DiagnosisID = @DiagnosisID
        `);
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

    // Return updated diagnosis with complete details
    return await getDiagnosisById(id);
}

// Get diagnoses by patient ID
const getDiagnosesByPatientId = async (patient_id) => {
    await poolConnect;
    const result = await pool.request()
        .input('patient_id', sql.Int, patient_id)
        .query(`
            SELECT d.*, 
                   p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
                   s.user_id as doctor_user_id, su.full_Name as doctor_name, s.specialization, s.license_number,
                   c.Name as condition_name, c.Description as condition_description, c.Status as condition_status
            FROM Diagnosis d
            JOIN patients p ON d.patient_id = p.patient_id
            JOIN users pu ON p.user_id = pu.user_id
            JOIN staff s ON d.doctor_id = s.staff_id
            JOIN users su ON s.user_id = su.user_id
            LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
            WHERE d.patient_id = @patient_id
            ORDER BY d.DiagnosisDate DESC
        `);
    return result.recordset;
}

// Get diagnoses by doctor/staff ID
const getDiagnosesByDoctorId = async (doctor_id) => {
    await poolConnect;
    const result = await pool.request()
        .input('doctor_id', sql.Int, doctor_id)
        .query(`
            SELECT d.*, 
                   p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
                   s.user_id as doctor_user_id, su.full_Name as doctor_name, s.specialization, s.license_number,
                   c.Name as condition_name, c.Description as condition_description, c.Status as condition_status
            FROM Diagnosis d
            JOIN patients p ON d.patient_id = p.patient_id
            JOIN users pu ON p.user_id = pu.user_id
            JOIN staff s ON d.doctor_id = s.staff_id
            JOIN users su ON s.user_id = su.user_id
            LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
            WHERE d.doctor_id = @doctor_id
            ORDER BY d.DiagnosisDate DESC
        `);
    return result.recordset;
}

// Get diagnoses by condition ID
const getDiagnosesByConditionId = async (condition_id) => {
    await poolConnect;
    const result = await pool.request()
        .input('condition_id', sql.Int, condition_id)
        .query(`
            SELECT d.*, 
                   p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
                   s.user_id as doctor_user_id, su.full_Name as doctor_name, s.specialization, s.license_number,
                   c.Name as condition_name, c.Description as condition_description, c.Status as condition_status
            FROM Diagnosis d
            JOIN patients p ON d.patient_id = p.patient_id
            JOIN users pu ON p.user_id = pu.user_id
            JOIN staff s ON d.doctor_id = s.staff_id
            JOIN users su ON s.user_id = su.user_id
            LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
            WHERE d.ConditionID = @condition_id
            ORDER BY d.DiagnosisDate DESC
        `);
    return result.recordset;
}

module.exports = {
    createDiagnosis,
    deleteDiagnosis,
    getAllDiagnoses,
    getDiagnosisById,
    updateDiagnosis,
    getDiagnosesByPatientId,
    getDiagnosesByDoctorId,
    getDiagnosesByConditionId
}
