// models/billingModel.js - Billing Data Model

const { poolConnect, sql } = require('../config/db');

class Bill {
  // Method to create a new bill
  static async create(billData) {
    const { patient_id, amount, status, due_date } = billData;
    await poolConnect;
    const request = pool.request();
    request.input('patient_id', sql.Int, patient_id);
    request.input('amount', sql.Decimal(10, 2), amount);
    request.input('status', sql.VarChar, status);
    request.input('due_date', sql.Date, due_date);
    const result = await request.query(
      'INSERT INTO billing (patient_id, amount, status, due_date) OUTPUT INSERTED.* VALUES (@patient_id, @amount, @status, @due_date)'
    );
    return result.recordset[0];
  }

  // Method to find all bills
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM billing');
    return result.recordset;
  }

  // Method to find a bill by ID
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM billing WHERE bill_id = @id');
    return result.recordset[0];
  }

  // Method to update a bill's information
  static async update(id, billData) {
    const { patient_id, amount, status, due_date } = billData;
    await poolConnect;
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('patient_id', sql.Int, patient_id);
    request.input('amount', sql.Decimal(10, 2), amount);
    request.input('status', sql.VarChar, status);
    request.input('due_date', sql.Date, due_date);
    const result = await request.query(
      'UPDATE billing SET patient_id = @patient_id, amount = @amount, status = @status, due_date = @due_date OUTPUT INSERTED.* WHERE bill_id = @id'
    );
    return result.recordset[0];
  }

  // Method to delete a bill
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM billing WHERE bill_id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Bill;