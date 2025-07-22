// models/appointmentsModel.js - Appointments Data Model

const { poolConnect, sql } = require('../config/db');

class Appointment {
  // Method to create a new appointment
  static async create(appointmentData) {
    const { patient_id, doctor_id, appointment_date, status } = appointmentData;
    await poolConnect;
    const request = pool.request();
    request.input('patient_id', sql.Int, patient_id);
    request.input('doctor_id', sql.Int, doctor_id);
    request.input('appointment_date', sql.DateTime, appointment_date);
    request.input('status', sql.VarChar, status);
    const result = await request.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, status) OUTPUT INSERTED.* VALUES (@patient_id, @doctor_id, @appointment_date, @status)'
    );
    return result.recordset[0];
  }

  // Method to find all appointments
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM appointments');
    return result.recordset;
  }

  // Method to find an appointment by ID
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM appointments WHERE appointment_id = @id');
    return result.recordset[0];
  }

  // Method to update an appointment's information
  static async update(id, appointmentData) {
    const { patient_id, doctor_id, appointment_date, status } = appointmentData;
    await poolConnect;
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('patient_id', sql.Int, patient_id);
    request.input('doctor_id', sql.Int, doctor_id);
    request.input('appointment_date', sql.DateTime, appointment_date);
    request.input('status', sql.VarChar, status);
    const result = await request.query(
      'UPDATE appointments SET patient_id = @patient_id, doctor_id = @doctor_id, appointment_date = @appointment_date, status = @status OUTPUT INSERTED.* WHERE appointment_id = @id'
    );
    return result.recordset[0];
  }

  // Method to delete an appointment
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM appointments WHERE appointment_id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Appointment;