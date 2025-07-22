// models/prescriptionsModel.js - Prescriptions Data Model

const { poolConnect, sql } = require('../config/db');

class Prescription {
  // Method to create a new prescription
  static async create(prescriptionData) {
    const { patient_id, doctor_id, medication, dosage, frequency, start_date, end_date } = prescriptionData;
    await poolConnect;
    const request = pool.request();
    request.input('patient_id', sql.Int, patient_id);
    request.input('doctor_id', sql.Int, doctor_id);
    request.input('medication', sql.VarChar, medication);
    request.input('dosage', sql.VarChar, dosage);
    request.input('frequency', sql.VarChar, frequency);
    request.input('start_date', sql.Date, start_date);
    request.input('end_date', sql.Date, end_date);
    const result = await request.query(
      'INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, frequency, start_date, end_date) OUTPUT INSERTED.* VALUES (@patient_id, @doctor_id, @medication, @dosage, @frequency, @start_date, @end_date)'
    );
    return result.recordset[0];
  }

  // Method to find all prescriptions
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM prescriptions');
    return result.recordset;
  }

  // Method to find a prescription by ID
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM prescriptions WHERE prescription_id = @id');
    return result.recordset[0];
  }

  // Method to update a prescription's information
  static async update(id, prescriptionData) {
    const { patient_id, doctor_id, medication, dosage, frequency, start_date, end_date } = prescriptionData;
    await poolConnect;
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('patient_id', sql.Int, patient_id);
    request.input('doctor_id', sql.Int, doctor_id);
    request.input('medication', sql.VarChar, medication);
    request.input('dosage', sql.VarChar, dosage);
    request.input('frequency', sql.VarChar, frequency);
    request.input('start_date', sql.Date, start_date);
    request.input('end_date', sql.Date, end_date);
    const result = await request.query(
      'UPDATE prescriptions SET patient_id = @patient_id, doctor_id = @doctor_id, medication = @medication, dosage = @dosage, frequency = @frequency, start_date = @start_date, end_date = @end_date OUTPUT INSERTED.* WHERE prescription_id = @id'
    );
    return result.recordset[0];
  }

  // Method to delete a prescription
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM prescriptions WHERE prescription_id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Prescription;