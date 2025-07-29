// models/appointmentsModel.js - Appointments Data Model

const { poolConnect, pool, sql } = require('../config/db');

class Appointment {
  // Method to create a new appointment
  static async create(appointmentData) {
    const { patient_id, staff_id, department_id, appointment_date, status, notes } = appointmentData;
    await poolConnect;
    const request = pool.request();
    request.input('patient_id', sql.Int, patient_id);
    request.input('staff_id', sql.Int, staff_id);
    request.input('department_id', sql.Int, department_id);
    request.input('appointment_date', sql.DateTime, appointment_date);
    request.input('status', sql.VarChar, status);
    request.input('notes', sql.Text, notes);
    const result = await request.query(
      'INSERT INTO appointments (patient_id, staff_id, department_id, appointment_date, status, notes) OUTPUT INSERTED.* VALUES (@patient_id, @staff_id, @department_id, @appointment_date, @status, @notes)'
    );
    return result.recordset[0];
  }

  // Method to find all appointments with patient, staff, and department details
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT a.*, 
             p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
             s.user_id as staff_user_id, su.full_Name as doctor_name, s.specialization, 
             d.name as department_name, d.description as department_description
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN users pu ON p.user_id = pu.user_id
      JOIN staff s ON a.staff_id = s.staff_id
      JOIN users su ON s.user_id = su.user_id
      JOIN departments d ON a.department_id = d.department_id
      ORDER BY a.appointment_date DESC
    `);
    return result.recordset;
  }

  // Method to find an appointment by ID with complete details
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT a.*, 
               p.user_id as patient_user_id, pu.full_Name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               s.user_id as staff_user_id, su.full_Name as doctor_name, s.specialization, 
               d.name as department_name, d.description as department_description
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN users pu ON p.user_id = pu.user_id
        JOIN staff s ON a.staff_id = s.staff_id
        JOIN users su ON s.user_id = su.user_id
        JOIN departments d ON a.department_id = d.department_id
        WHERE a.appointment_id = @id
      `);
    return result.recordset[0];
  }

  // Method to update an appointment's information
  static async update(id, appointmentData) {
    const { patient_id, staff_id, department_id, appointment_date, status, notes } = appointmentData;
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
    if (department_id !== undefined) {
      request.input('department_id', sql.Int, department_id);
      fields.push('department_id = @department_id');
    }
    if (appointment_date !== undefined) {
      request.input('appointment_date', sql.DateTime, appointment_date);
      fields.push('appointment_date = @appointment_date');
    }
    if (status !== undefined) {
      request.input('status', sql.VarChar, status);
      fields.push('status = @status');
    }
    if (notes !== undefined) {
      request.input('notes', sql.Text, notes);
      fields.push('notes = @notes');
    }
    
    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }
    
    const updateQuery = `UPDATE appointments SET ${fields.join(', ')} WHERE appointment_id = @id`;
    await request.query(updateQuery);
    
    // Return updated appointment with complete details
    return await Appointment.findById(id);
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