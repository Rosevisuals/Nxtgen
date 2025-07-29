// models/patientModel.js - Patient Data Model
// This file defines the schema for the patient data and functions to interact with the database.
// Patients are linked to users through user_id

const { poolConnect, pool, sql } = require('../config/db');

class Patient {
  // Method to create a new patient
  static async create(patientData) {
    const { user_id, blood_group, BMI, NOTES, emergency_contact } = patientData;
    await poolConnect;
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);
    request.input('blood_group', sql.VarChar(5), blood_group);
    request.input('BMI', sql.VarChar(25), BMI);
    request.input('NOTES', sql.VarChar(50), NOTES);
    request.input('emergency_contact', sql.VarChar(100), emergency_contact);
    request.input('created_at', sql.DateTime, new Date());
    const result = await request.query(
      'INSERT INTO patients (user_id, blood_group, BMI, NOTES, emergency_contact, created_at) OUTPUT INSERTED.* VALUES (@user_id, @blood_group, @BMI, @NOTES, @emergency_contact, @created_at)'
    );
    return result.recordset[0];
  }

  // Method to find all patients with user details
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT p.*, u.full_Name, u.email, u.phone, u.gender, u.DOB, u.marital_status, u.Address, u.status
      FROM patients p
      JOIN users u ON p.user_id = u.user_id
    `);
    return result.recordset;
  }

  // Method to find a patient by ID with user details
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT p.*, u.full_Name, u.email, u.phone, u.gender, u.DOB, u.marital_status, u.Address, u.status
        FROM patients p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.patient_id = @id
      `);
    return result.recordset[0];
  }

  // Method to find a patient by user_id
  static async findByUserId(user_id) {
    await poolConnect;
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query(`
        SELECT p.*, u.full_Name, u.email, u.phone, u.gender, u.DOB, u.marital_status, u.Address, u.status
        FROM patients p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.user_id = @user_id
      `);
    return result.recordset[0];
  }

  // Method to update a patient's medical information
  static async update(id, patientData) {
    const { blood_group, BMI, NOTES, emergency_contact } = patientData;
    await poolConnect;
    const request = pool.request();
    const fields = [];
    
    request.input('id', sql.Int, id);
    
    if (blood_group !== undefined) {
      request.input('blood_group', sql.VarChar(5), blood_group);
      fields.push('blood_group = @blood_group');
    }
    if (BMI !== undefined) {
      request.input('BMI', sql.VarChar(25), BMI);
      fields.push('BMI = @BMI');
    }
    if (NOTES !== undefined) {
      request.input('NOTES', sql.VarChar(50), NOTES);
      fields.push('NOTES = @NOTES');
    }
    if (emergency_contact !== undefined) {
      request.input('emergency_contact', sql.VarChar(100), emergency_contact);
      fields.push('emergency_contact = @emergency_contact');
    }
    
    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }
    
    const updateQuery = `UPDATE patients SET ${fields.join(', ')} WHERE patient_id = @id`;
    await request.query(updateQuery);
    
    // Return updated patient with user details
    return await Patient.findById(id);
  }

  // Method to delete a patient
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM patients WHERE patient_id = @id');
    return result.rowsAffected[0] > 0;
  }

  // Method to get patient's appointments
  static async getAppointments(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT a.*, s.user_id as staff_user_id, u.full_Name as doctor_name, d.name as department_name
        FROM appointments a
        JOIN staff s ON a.staff_id = s.staff_id
        JOIN users u ON s.user_id = u.user_id
        JOIN departments d ON a.department_id = d.department_id
        WHERE a.patient_id = @patient_id
        ORDER BY a.appointment_date DESC
      `);
    return result.recordset;
  }

  // Method to get patient's diagnoses
  static async getDiagnoses(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT d.*, c.Name as condition_name, c.Description as condition_description,
               s.user_id as doctor_user_id, u.full_Name as doctor_name
        FROM Diagnosis d
        JOIN Conditions c ON d.ConditionID = c.ConditionID
        JOIN staff s ON d.doctor_id = s.staff_id
        JOIN users u ON s.user_id = u.user_id
        WHERE d.patient_id = @patient_id
        ORDER BY d.DiagnosisDate DESC
      `);
    return result.recordset;
  }

  // Method to get patient's prescriptions
  static async getPrescriptions(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT p.*, s.user_id as staff_user_id, u.full_Name as doctor_name,
               d.DiagnosisDate, c.Name as condition_name
        FROM prescriptions p
        JOIN staff s ON p.staff_id = s.staff_id
        JOIN users u ON s.user_id = u.user_id
        LEFT JOIN Diagnosis d ON p.DiagnosisID = d.DiagnosisID
        LEFT JOIN Conditions c ON d.ConditionID = c.ConditionID
        WHERE p.patient_id = @patient_id
        ORDER BY p.date_issued DESC
      `);
    return result.recordset;
  }

  // Method to get patient's lab requests
  static async getLabRequests(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT lr.*, tt.Name_of_test,
               ds.user_id as doctor_user_id, du.full_Name as doctor_name,
               ts.user_id as technician_user_id, tu.full_Name as technician_name
        FROM labrequests lr
        JOIN testtype tt ON lr.test_id = tt.test_id
        JOIN staff ds ON lr.doctor_id = ds.staff_id
        JOIN users du ON ds.user_id = du.user_id
        LEFT JOIN staff ts ON lr.technician_id = ts.staff_id
        LEFT JOIN users tu ON ts.user_id = tu.user_id
        WHERE lr.patient_id = @patient_id
        ORDER BY lr.date_conducted DESC
      `);
    return result.recordset;
  }

  // Method to get patient's billing records
  static async getBilling(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT * FROM billing
        WHERE patient_id = @patient_id
        ORDER BY date_issued DESC
      `);
    return result.recordset;
  }
}

// Combined registration function - takes separate user and patient data objects
async function registerPatientComplete(userData, patientData) {
  await poolConnect;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();

    // Step 1: Create user
    const userInsertResult = await transaction.request()
      .input('full_Name', sql.VarChar(50), userData.full_Name)
      .input('email', sql.VarChar(100), userData.email)
      .input('phone', sql.VarChar(20), userData.phone)
      .input('password_hash', sql.VarChar(255), userData.password_hash)
      .input('gender', sql.VarChar(5), userData.gender)
      .input('DOB', sql.Date, userData.DOB)
      .input('marital_status', sql.VarChar(25), userData.marital_status)
      .input('Address', sql.VarChar(50), userData.Address)
      .input('status', sql.VarChar(20), userData.status || 'active')
      .input('created_at', sql.DateTime, new Date())
      .query('INSERT INTO users (full_Name, email, phone, password_hash, gender, DOB, marital_status, Address, status, created_at) OUTPUT INSERTED.user_id VALUES (@full_Name, @email, @phone, @password_hash, @gender, @DOB, @marital_status, @Address, @status, @created_at)');

    const user_id = userInsertResult.recordset[0].user_id;

    // Step 2: Create patient
    const patientInsertResult = await transaction.request()
      .input('user_id', sql.Int, user_id)
      .input('blood_group', sql.VarChar(5), patientData.blood_group)
      .input('BMI', sql.VarChar(25), patientData.BMI)
      .input('NOTES', sql.VarChar(50), patientData.NOTES)
      .input('emergency_contact', sql.VarChar(100), patientData.emergency_contact)
      .input('created_at', sql.DateTime, new Date())
      .query('INSERT INTO patients (user_id, blood_group, BMI, NOTES, emergency_contact, created_at) OUTPUT INSERTED.* VALUES (@user_id, @blood_group, @BMI, @NOTES, @emergency_contact, @created_at)');

    await transaction.commit();

    // Return complete patient info with user details
    const completePatient = await Patient.findById(patientInsertResult.recordset[0].patient_id);
    return completePatient;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Simplified registration function - takes single data object with all fields
async function registerPatient(allData) {
  // Split the data into user and patient parts
  const userData = {
    full_Name: allData.full_Name,
    email: allData.email,
    phone: allData.phone,
    password_hash: allData.password_hash,
    gender: allData.gender,
    DOB: allData.DOB,
    marital_status: allData.marital_status,
    Address: allData.Address,
    status: allData.status || 'active'
  };

  const patientData = {
    blood_group: allData.blood_group,
    BMI: allData.BMI,
    NOTES: allData.NOTES,
    emergency_contact: allData.emergency_contact
  };

  return await registerPatientComplete(userData, patientData);
}

module.exports = { Patient, registerPatientComplete, registerPatient };
