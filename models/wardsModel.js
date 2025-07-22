const { sql, poolConnect, pool } = require('../config/db');

const createWard = async (ward) => {
  await poolConnect;

  const request = pool.request();
  request.input('Department_id', sql.Int, ward.Department_id);
  request.input('ward_number', sql.VarChar(25), ward.ward_number);
  request.input('ward_type', sql.VarChar(25), ward.ward_type);

  const result = await request.query(`
    INSERT INTO wards (Department_id, ward_number, ward_type)
    VALUES (@Department_id, @ward_number, @ward_type);
    SELECT SCOPE_IDENTITY() AS ward_id;
    `);

  const ward_id = result.recordset[0].ward_id;
  const wardResult = await pool.request().input('ward_id', sql.Int, ward_id)
    .query('SELECT * FROM wards WHERE ward_id = @ward_id');

  return wardResult.recordset[0];
};

const deleteWard = async (ward_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('ward_id', sql.Int, ward_id);
  await request.query('DELETE FROM wards WHERE ward_id = @ward_id');
  return true;
};

const getAllWards = async () => {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM wards');
  return result.recordset;
};

const getWardById = async (ward_id) => {
  await poolConnect;
  const request = pool.request();
  request.input('ward_id', sql.Int, ward_id);
  const result = await request.query('SELECT * FROM wards WHERE ward_id = @ward_id');
  return result.recordset[0];
};

const updateWard = async (ward_id, updates) => {
  await poolConnect;
  const fields = [];

  const request = pool.request();
  if (updates.Department_id) {
    request.input('Department_id', sql.Int, ward.Department_id);
    fields.push('Department_id = @Department_id');
  }
  if (updates.ward_number) {
    request.input('ward_number', sql.VarChar(25), ward.ward_number);
    fields.push('ward_number = @ward_number');
  }
  if (updates.ward_type) {
    request.input('ward_type', sql.VarChar(25), ward.ward_type);
    fields.push('ward_type = @ward_type');
  }
  if (fields.length === 0) return null;
  request.input('ward_id', sql.Int, ward_id);

  const result = await request.query(`
    UPDATE wards SET ${fields.join(', ')} WHERE ward_id = @ward_id;
    SELECT * FROM wards WHERE ward_id = @ward_id;
  `);

  return result.recordset[0];
};

module.exports = {
  createWard,
  deleteWard,
  getAllWards,
  getWardById,
  updateWard
}; 