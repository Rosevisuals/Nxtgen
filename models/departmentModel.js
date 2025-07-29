// models/departmentModel.js - Department Data Model

const { poolConnect, pool, sql } = require('../config/db');

class Department {
  // Method to create a new department
  static async create(departmentData) {
    const { name, description } = departmentData;
    await poolConnect;
    const request = pool.request();
    request.input('name', sql.VarChar(100), name);
    request.input('description', sql.Text, description);
    const result = await request.query(
      'INSERT INTO departments (name, description) OUTPUT INSERTED.* VALUES (@name, @description)'
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
    const { name, description } = departmentData;
    await poolConnect;
    const request = pool.request();
    const fields = [];
    
    request.input('id', sql.Int, id);
    
    if (name !== undefined) {
      request.input('name', sql.VarChar(100), name);
      fields.push('name = @name');
    }
    if (description !== undefined) {
      request.input('description', sql.Text, description);
      fields.push('description = @description');
    }
    
    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }
    
    const updateQuery = `UPDATE departments SET ${fields.join(', ')} WHERE department_id = @id`;
    await request.query(updateQuery);
    
    // Return updated department
    return await Department.findById(id);
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