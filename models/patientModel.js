// models/patientModel.js - Patient Data Model
// This file defines the schema for the patient data and functions to interact with the database.

const { poolConnect, sql } = require('../config/db');

class Patient {
  // Method to create a new patient
  static async create(patientData) {
    const { full_name, date_of_birth, gender, phone_number, address, doctor_id } = patientData;
    await poolConnect;
    const request = pool.request();
    request.input('full_name', sql.VarChar, full_name);
    request.input('date_of_birth', sql.Date, date_of_birth);
    request.input('gender', sql.VarChar, gender);
    request.input('phone_number', sql.VarChar, phone_number);
    request.input('address', sql.Text, address);
    request.input('doctor_id', sql.Int, doctor_id);
    const result = await request.query(
      'INSERT INTO patients (full_name, date_of_birth, gender, phone_number, address, doctor_id) OUTPUT INSERTED.* VALUES (@full_name, @date_of_birth, @gender, @phone_number, @address, @doctor_id)'
    );
    return result.recordset[0];
  }

  // Method to find all patients
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM patients');
    return result.recordset;
  }

  // Method to find a patient by ID
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM patients WHERE patient_id = @id');
    return result.recordset[0];
  }

  // Method to update a patient's information
  static async update(id, patientData) {
    const { full_name, date_of_birth, gender, phone_number, address, doctor_id } = patientData;
    await poolConnect;
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('full_name', sql.VarChar, full_name);
    request.input('date_of_birth', sql.Date, date_of_birth);
    request.input('gender', sql.VarChar, gender);
    request.input('phone_number', sql.VarChar, phone_number);
    request.input('address', sql.Text, address);
    request.input('doctor_id', sql.Int, doctor_id);
    const result = await request.query(
      'UPDATE patients SET full_name = @full_name, date_of_birth = @date_of_birth, gender = @gender, phone_number = @phone_number, address = @address, doctor_id = @doctor_id OUTPUT INSERTED.* WHERE patient_id = @id'
    );
    return result.recordset[0];
  }

  // Method to delete a patient
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM patients WHERE patient_id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Patient;