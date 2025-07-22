// models/departmentModel.js - Department Data Model

const { poolConnect, sql } = require('../config/db');

class Department {
  // Method to create a new department
  static async create(departmentData) {
    const { department_name } = departmentData;
    await poolConnect;
    const request = pool.request();
    request.input('department_name', sql.VarChar, department_name);
    const result = await request.query(
      'INSERT INTO departments (department_name) OUTPUT INSERTED.* VALUES (@department_name)'
    );
    return result.recordset[0];
  }

  // Method to find all departments
  static async findAll() {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM departments');
    return result.recordset;
  }

  // Method to find a department by ID
  static async findById(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM departments WHERE department_id = @id');
    return result.recordset[0];
  }

  // Method to update a department's information
  static async update(id, departmentData) {
    const { department_name } = departmentData;
    await poolConnect;
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('department_name', sql.VarChar, department_name);
    const result = await request.query(
      'UPDATE departments SET department_name = @department_name OUTPUT INSERTED.* WHERE department_id = @id'
    );
    return result.recordset[0];
  }

  // Method to delete a department
  static async delete(id) {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM departments WHERE department_id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Department;