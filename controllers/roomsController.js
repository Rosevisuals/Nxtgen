const { poolConnect, pool, sql } = require('../config/db');

// ===== ROOMS CRUD =====
const getAllRooms = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT r.*, w.ward_name
      FROM rooms r
      LEFT JOIN wards w ON r.ward_id = w.ward_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching rooms:', error.message);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('room_id', sql.Int, id)
      .query('SELECT * FROM rooms WHERE room_id = @room_id');
    const room = result.recordset[0];
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error.message);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

const createRoom = async (req, res) => {
  const { room_number, type, status, ward_id, notes } = req.body;
  if (!room_number || !type || !ward_id) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('room_number', sql.VarChar, room_number)
      .input('type', sql.VarChar, type)
      .input('status', sql.VarChar, status || 'available')
      .input('ward_id', sql.Int, ward_id)
      .input('notes', sql.Text, notes || null)
      .query(`INSERT INTO rooms (room_number, type, status, ward_id, notes)
        OUTPUT INSERTED.*
        VALUES (@room_number, @type, @status, @ward_id, @notes)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating room:', error.message);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_number, type, status, ward_id, notes } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (room_number) fields.push('room_number = @room_number');
    if (type) fields.push('type = @type');
    if (status) fields.push('status = @status');
    if (ward_id) fields.push('ward_id = @ward_id');
    if (notes) fields.push('notes = @notes');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE rooms SET ${fields.join(', ')} WHERE room_id = @room_id`;
    const request = pool.request().input('room_id', sql.Int, id);
    if (room_number) request.input('room_number', sql.VarChar, room_number);
    if (type) request.input('type', sql.VarChar, type);
    if (status) request.input('status', sql.VarChar, status);
    if (ward_id) request.input('ward_id', sql.Int, ward_id);
    if (notes) request.input('notes', sql.Text, notes);
    await request.query(updateQuery);
    const result = await pool.request().input('room_id', sql.Int, id).query('SELECT * FROM rooms WHERE room_id = @room_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Room not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating room:', error.message);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('room_id', sql.Int, id).query('DELETE FROM rooms WHERE room_id = @room_id');
    res.json({ message: 'Room deleted' });
  } catch (error) {
    console.error('Error deleting room:', error.message);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

// ===== ROOM ALLOTMENTS CRUD =====
const getAllRoomAllotments = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT a.*, r.room_number, p.full_name AS patient_name
      FROM room_allotments a
      JOIN rooms r ON a.room_id = r.room_id
      JOIN patients p ON a.patient_id = p.patient_id
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching room allotments:', error.message);
    res.status(500).json({ error: 'Failed to fetch room allotments' });
  }
};

const getRoomAllotmentById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('allotment_id', sql.Int, id)
      .query('SELECT * FROM room_allotments WHERE allotment_id = @allotment_id');
    const allotment = result.recordset[0];
    if (!allotment) return res.status(404).json({ message: 'Room allotment not found' });
    res.json(allotment);
  } catch (error) {
    console.error('Error fetching room allotment:', error.message);
    res.status(500).json({ error: 'Failed to fetch room allotment' });
  }
};

const createRoomAllotment = async (req, res) => {
  const { room_id, patient_id, start_date, end_date, status, notes } = req.body;
  if (!room_id || !patient_id || !start_date) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const insertResult = await pool.request()
      .input('room_id', sql.Int, room_id)
      .input('patient_id', sql.Int, patient_id)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date || null)
      .input('status', sql.VarChar, status || 'active')
      .input('notes', sql.Text, notes || null)
      .query(`INSERT INTO room_allotments (room_id, patient_id, start_date, end_date, status, notes)
        OUTPUT INSERTED.*
        VALUES (@room_id, @patient_id, @start_date, @end_date, @status, @notes)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating room allotment:', error.message);
    res.status(500).json({ error: 'Failed to create room allotment' });
  }
};

const updateRoomAllotment = async (req, res) => {
  const { id } = req.params;
  const { room_id, patient_id, start_date, end_date, status, notes } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (room_id) fields.push('room_id = @room_id');
    if (patient_id) fields.push('patient_id = @patient_id');
    if (start_date) fields.push('start_date = @start_date');
    if (end_date) fields.push('end_date = @end_date');
    if (status) fields.push('status = @status');
    if (notes) fields.push('notes = @notes');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE room_allotments SET ${fields.join(', ')} WHERE allotment_id = @allotment_id`;
    const request = pool.request().input('allotment_id', sql.Int, id);
    if (room_id) request.input('room_id', sql.Int, room_id);
    if (patient_id) request.input('patient_id', sql.Int, patient_id);
    if (start_date) request.input('start_date', sql.Date, start_date);
    if (end_date) request.input('end_date', sql.Date, end_date);
    if (status) request.input('status', sql.VarChar, status);
    if (notes) request.input('notes', sql.Text, notes);
    await request.query(updateQuery);
    const result = await pool.request().input('allotment_id', sql.Int, id).query('SELECT * FROM room_allotments WHERE allotment_id = @allotment_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Room allotment not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating room allotment:', error.message);
    res.status(500).json({ error: 'Failed to update room allotment' });
  }
};

const deleteRoomAllotment = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('allotment_id', sql.Int, id).query('DELETE FROM room_allotments WHERE allotment_id = @allotment_id');
    res.json({ message: 'Room allotment deleted' });
  } catch (error) {
    console.error('Error deleting room allotment:', error.message);
    res.status(500).json({ error: 'Failed to delete room allotment' });
  }
};

module.exports = {
  // Rooms
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  // Room Allotments
  getAllRoomAllotments,
  getRoomAllotmentById,
  createRoomAllotment,
  updateRoomAllotment,
  deleteRoomAllotment
}; 