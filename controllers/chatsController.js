const { poolConnect, pool, sql } = require('../config/db');

// ===== CHATS CRUD =====
const getAllChats = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT c.*, s.full_name AS sender_name, r.full_name AS receiver_name
      FROM chats c
      JOIN users s ON c.sender_user_id = s.user_id
      JOIN users r ON c.receiver_user_id = r.user_id
      ORDER BY c.sent_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching chats:', error.message);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

const getChatById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('chat_id', sql.Int, id)
      .query('SELECT * FROM chats WHERE chat_id = @chat_id');
    const chat = result.recordset[0];
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error.message);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

const createChat = async (req, res) => {
  const { sender_user_id, receiver_user_id, message, status } = req.body;
  if (!sender_user_id || !receiver_user_id || !message) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('sender_user_id', sql.Int, sender_user_id)
      .input('receiver_user_id', sql.Int, receiver_user_id)
      .input('message', sql.Text, message)
      .input('status', sql.VarChar, status || 'sent')
      .input('sent_at', sql.DateTime, now)
      .query(`INSERT INTO chats (sender_user_id, receiver_user_id, message, status, sent_at)
        OUTPUT INSERTED.*
        VALUES (@sender_user_id, @receiver_user_id, @message, @status, @sent_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating chat:', error.message);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

const updateChat = async (req, res) => {
  const { id } = req.params;
  const { message, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (message) fields.push('message = @message');
    if (status) fields.push('status = @status');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE chats SET ${fields.join(', ')} WHERE chat_id = @chat_id`;
    const request = pool.request().input('chat_id', sql.Int, id);
    if (message) request.input('message', sql.Text, message);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request().input('chat_id', sql.Int, id).query('SELECT * FROM chats WHERE chat_id = @chat_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Chat not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating chat:', error.message);
    res.status(500).json({ error: 'Failed to update chat' });
  }
};

const deleteChat = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('chat_id', sql.Int, id).query('DELETE FROM chats WHERE chat_id = @chat_id');
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    console.error('Error deleting chat:', error.message);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat
}; 