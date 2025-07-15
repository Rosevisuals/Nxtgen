const { poolConnect, pool, sql } = require('../config/db');

// ===== EMAILS CRUD =====
const getAllEmails = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT e.*, s.full_name AS sender_name, r.full_name AS receiver_name
      FROM emails e
      JOIN users s ON e.sender_user_id = s.user_id
      JOIN users r ON e.receiver_user_id = r.user_id
      ORDER BY e.sent_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

const getEmailById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('email_id', sql.Int, id)
      .query('SELECT * FROM emails WHERE email_id = @email_id');
    const email = result.recordset[0];
    if (!email) return res.status(404).json({ message: 'Email not found' });
    res.json(email);
  } catch (error) {
    console.error('Error fetching email:', error.message);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
};

const createEmail = async (req, res) => {
  const { sender_user_id, receiver_user_id, subject, body, status } = req.body;
  if (!sender_user_id || !receiver_user_id || !subject || !body) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('sender_user_id', sql.Int, sender_user_id)
      .input('receiver_user_id', sql.Int, receiver_user_id)
      .input('subject', sql.VarChar, subject)
      .input('body', sql.Text, body)
      .input('status', sql.VarChar, status || 'sent')
      .input('sent_at', sql.DateTime, now)
      .query(`INSERT INTO emails (sender_user_id, receiver_user_id, subject, body, status, sent_at)
        OUTPUT INSERTED.*
        VALUES (@sender_user_id, @receiver_user_id, @subject, @body, @status, @sent_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating email:', error.message);
    res.status(500).json({ error: 'Failed to create email' });
  }
};

const updateEmail = async (req, res) => {
  const { id } = req.params;
  const { subject, body, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (subject) fields.push('subject = @subject');
    if (body) fields.push('body = @body');
    if (status) fields.push('status = @status');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE emails SET ${fields.join(', ')} WHERE email_id = @email_id`;
    const request = pool.request().input('email_id', sql.Int, id);
    if (subject) request.input('subject', sql.VarChar, subject);
    if (body) request.input('body', sql.Text, body);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request().input('email_id', sql.Int, id).query('SELECT * FROM emails WHERE email_id = @email_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Email not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating email:', error.message);
    res.status(500).json({ error: 'Failed to update email' });
  }
};

const deleteEmail = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('email_id', sql.Int, id).query('DELETE FROM emails WHERE email_id = @email_id');
    res.json({ message: 'Email deleted' });
  } catch (error) {
    console.error('Error deleting email:', error.message);
    res.status(500).json({ error: 'Failed to delete email' });
  }
};

module.exports = {
  getAllEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail
}; 