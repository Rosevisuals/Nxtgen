// models/prescriptionsModel.js - Prescriptions Data Model

const { poolConnect, pool, sql } = require('../config/db');

class Prescription {
  // Method to create a new prescription
  static async create(prescriptionData) {
    const { patient_id, staff_id, DiagnosisID, medication, dosage, date_issued, notes } = prescriptionData;
    await poolConnect;
    const request = pool.request();
    request.input('patient_id', sql.Int, patient_id);
    request.input('staff_id', sql.Int, staff_id);
    request.input('DiagnosisID', sql.Int, DiagnosisID);
    request.input('medication', sql.VarChar, medication);
    request.input('dosage', sql.VarChar, dosage);
    request.input('date_issued', sql.DateTime, date_issued);
    request.input('notes', sql.Text, notes);
    const result = await request.query(
      'INSERT INTO prescriptions (patient_id, staff_id, DiagnosisID, Medication, dosage, date_issued, notes) OUTPUT INSERTED.* VALUES (@patient_id, @staff_id, @DiagnosisID, @medication, @dosage, @date_issued, @notes)'
    );
    return result.recordset[0];
  }

  // Method to find all prescriptions with patient, staff, and diagnosis details
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT p.*, 
             pt.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
             s.user_id as staff_user_id, su.full_Name as staff_name, s.specialization, 
             d.DiagnosisDate, c.Name as condition_name
      FROM prescriptions p
      JOIN patients pt ON p.patient_id = pt.patient_id
      JOIN users pu ON pt.user_id = pu.user_id
      JOIN staff s ON p.staff_id = s.staff_id
      JOIN users su ON s.user_id = su.user_id
      LEFT JOIN Diagnosis d ON p.DiagnosisID = d.DiagnosisID
      LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
      ORDER BY p.date_issued DESC
    `);
    return result.recordset;
  }

  // Method to find a prescription by ID with complete details
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT p.*, 
               pt.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               s.user_id as staff_user_id, su.full_Name as staff_name, s.specialization, 
               d.DiagnosisDate, c.Name as condition_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        JOIN users pu ON pt.user_id = pu.user_id
        JOIN staff s ON p.staff_id = s.staff_id
        JOIN users su ON s.user_id = su.user_id
        LEFT JOIN Diagnosis d ON p.DiagnosisID = d.DiagnosisID
        LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
        WHERE p.prescription_id = @id
      `);
    return result.recordset[0];
  }

  // Method to update a prescription's information
  static async update(id, prescriptionData) {
    const { patient_id, staff_id, DiagnosisID, medication, dosage, date_issued, notes } = prescriptionData;
    await poolConnect;
    const request = pool.request();
    const fields = [];
    
    request.input('id', sql.Int, id);
    
    if (patient_id !== undefined) {
      request.input('patient_id', sql.Int, patient_id);
      fields.push('patient_id = @patient_id');
    }
    if (staff_id !== undefined) {
      request.input('staff_id', sql.Int, staff_id);
      fields.push('staff_id = @staff_id');
    }
    if (DiagnosisID !== undefined) {
      request.input('DiagnosisID', sql.Int, DiagnosisID);
      fields.push('DiagnosisID = @DiagnosisID');
    }
    if (medication !== undefined) {
      request.input('medication', sql.VarChar, medication);
      fields.push('Medication = @medication');
    }
    if (dosage !== undefined) {
      request.input('dosage', sql.VarChar, dosage);
      fields.push('dosage = @dosage');
    }
    if (date_issued !== undefined) {
      request.input('date_issued', sql.DateTime, date_issued);
      fields.push('date_issued = @date_issued');
    }
    if (notes !== undefined) {
      request.input('notes', sql.Text, notes);
      fields.push('notes = @notes');
    }
    
    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }
    
    const updateQuery = `UPDATE prescriptions SET ${fields.join(', ')} WHERE prescription_id = @id`;
    await request.query(updateQuery);
    
    // Return updated prescription with complete details
    return await Prescription.findById(id);
  }

  // Method to delete a prescription
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM prescriptions WHERE prescription_id = @id');
    return result.rowsAffected[0] > 0;
  }

  // Get prescriptions by patient ID
  static async findByPatientId(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT p.*, 
               pt.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               s.user_id as staff_user_id, su.full_Name as staff_name, s.specialization, 
               d.DiagnosisDate, c.Name as condition_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        JOIN users pu ON pt.user_id = pu.user_id
        JOIN staff s ON p.staff_id = s.staff_id
        JOIN users su ON s.user_id = su.user_id
        LEFT JOIN Diagnosis d ON p.DiagnosisID = d.DiagnosisID
        LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
        WHERE p.patient_id = @patient_id
        ORDER BY p.date_issued DESC
      `);
    return result.recordset;
  }

  // Get prescriptions by staff ID
  static async findByStaffId(staff_id) {
    await poolConnect;
    const result = await pool.request()
      .input('staff_id', sql.Int, staff_id)
      .query(`
        SELECT p.*, 
               pt.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               s.user_id as staff_user_id, su.full_Name as staff_name, s.specialization, 
               d.DiagnosisDate, c.Name as condition_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        JOIN users pu ON pt.user_id = pu.user_id
        JOIN staff s ON p.staff_id = s.staff_id
        JOIN users su ON s.user_id = su.user_id
        LEFT JOIN Diagnosis d ON p.DiagnosisID = d.DiagnosisID
        LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
        WHERE p.staff_id = @staff_id
        ORDER BY p.date_issued DESC
      `);
    return result.recordset;
  }

  // Get prescriptions by diagnosis ID
  static async findByDiagnosisId(diagnosis_id) {
    await poolConnect;
    const result = await pool.request()
      .input('diagnosis_id', sql.Int, diagnosis_id)
      .query(`
        SELECT p.*, 
               pt.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               s.user_id as staff_user_id, su.full_Name as staff_name, s.specialization, 
               d.DiagnosisDate, c.Name as condition_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        JOIN users pu ON pt.user_id = pu.user_id
        JOIN staff s ON p.staff_id = s.staff_id
        JOIN users su ON s.user_id = su.user_id
        LEFT JOIN Diagnosis d ON p.DiagnosisID = d.DiagnosisID
        LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
        WHERE p.DiagnosisID = @diagnosis_id
        ORDER BY p.date_issued DESC
      `);
    return result.recordset;
  }
}

module.exports = Prescription;
