// models/billingModel.js - Billing Data Model

const { poolConnect, pool, sql } = require('../config/db');

class Bill {
  // Method to create a new bill
  static async create(billData) {
    const { patient_id, amount, date_issued, method_of_payment, service_name, service_id, received_by, paid_by, status } = billData;
    await poolConnect;
    const request = pool.request();
    request.input('patient_id', sql.Int, patient_id);
    request.input('amount', sql.Decimal(10, 2), amount);
    request.input('date_issued', sql.DateTime, date_issued);
    request.input('method_of_payment', sql.VarChar(20), method_of_payment);
    request.input('service_name', sql.VarChar(35), service_name);
    request.input('service_id', sql.Int, service_id);
    request.input('received_by', sql.VarChar(25), received_by);
    request.input('paid_by', sql.VarChar(30), paid_by);
    request.input('status', sql.VarChar(30), status);
    const result = await request.query(
      'INSERT INTO billing (patient_id, amount, date_issued, method_of_payment, service_name, service_id, received_by, paid_by, status) OUTPUT INSERTED.* VALUES (@patient_id, @amount, @date_issued, @method_of_payment, @service_name, @service_id, @received_by, @paid_by, @status)'
    );
    return result.recordset[0];
  }

  // Method to find all bills with patient details
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT b.*, p.user_id as patient_user_id, u.full_Name as patient_name, u.email as patient_email, u.phone as patient_phone
      FROM billing b
      JOIN patients p ON b.patient_id = p.patient_id
      JOIN users u ON p.user_id = u.user_id
      ORDER BY b.date_issued DESC
    `);
    return result.recordset;
  }

  // Method to find a bill by ID with patient details
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT b.*, p.user_id as patient_user_id, u.full_Name as patient_name, u.email as patient_email, u.phone as patient_phone
        FROM billing b
        JOIN patients p ON b.patient_id = p.patient_id
        JOIN users u ON p.user_id = u.user_id
        WHERE b.bill_id = @id
      `);
    return result.recordset[0];
  }

  // Method to update a bill's information
  static async update(id, billData) {
    const { patient_id, amount, date_issued, method_of_payment, service_name, service_id, received_by, paid_by, status } = billData;
    await poolConnect;
    const request = pool.request();
    const fields = [];
    
    request.input('id', sql.Int, id);
    
    if (patient_id !== undefined) {
      request.input('patient_id', sql.Int, patient_id);
      fields.push('patient_id = @patient_id');
    }
    if (amount !== undefined) {
      request.input('amount', sql.Decimal(10, 2), amount);
      fields.push('amount = @amount');
    }
    if (date_issued !== undefined) {
      request.input('date_issued', sql.DateTime, date_issued);
      fields.push('date_issued = @date_issued');
    }
    if (method_of_payment !== undefined) {
      request.input('method_of_payment', sql.VarChar(20), method_of_payment);
      fields.push('method_of_payment = @method_of_payment');
    }
    if (service_name !== undefined) {
      request.input('service_name', sql.VarChar(35), service_name);
      fields.push('service_name = @service_name');
    }
    if (service_id !== undefined) {
      request.input('service_id', sql.Int, service_id);
      fields.push('service_id = @service_id');
    }
    if (received_by !== undefined) {
      request.input('received_by', sql.VarChar(25), received_by);
      fields.push('received_by = @received_by');
    }
    if (paid_by !== undefined) {
      request.input('paid_by', sql.VarChar(30), paid_by);
      fields.push('paid_by = @paid_by');
    }
    if (status !== undefined) {
      request.input('status', sql.VarChar(30), status);
      fields.push('status = @status');
    }
    
    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }
    
    const updateQuery = `UPDATE billing SET ${fields.join(', ')} WHERE bill_id = @id`;
    await request.query(updateQuery);
    
    // Return updated bill with patient details
    return await Bill.findById(id);
  }

  // Method to delete a bill
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM billing WHERE bill_id = @id');
    return result.rowsAffected[0] > 0;
  }

  // Get bills by patient ID
  static async findByPatientId(patient_id) {
    await poolConnect;
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query(`
        SELECT b.*, p.user_id as patient_user_id, u.full_Name as patient_name, u.email as patient_email, u.phone as patient_phone
        FROM billing b
        JOIN patients p ON b.patient_id = p.patient_id
        JOIN users u ON p.user_id = u.user_id
        WHERE b.patient_id = @patient_id
        ORDER BY b.date_issued DESC
      `);
    return result.recordset;
  }
}

module.exports = Bill;