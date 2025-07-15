const { poolConnect, pool, sql } = require('../config/db');

// ===== SUPPORT TICKETS CRUD =====
const getAllSupportTickets = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT t.*, u.full_name AS user_name, u.email
      FROM support_tickets t
      JOIN users u ON t.user_id = u.user_id
      ORDER BY t.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching support tickets:', error.message);
    res.status(500).json({ error: 'Failed to fetch support tickets' });
  }
};

const getSupportTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('ticket_id', sql.Int, id)
      .query('SELECT * FROM support_tickets WHERE ticket_id = @ticket_id');
    const ticket = result.recordset[0];
    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching support ticket:', error.message);
    res.status(500).json({ error: 'Failed to fetch support ticket' });
  }
};

const createSupportTicket = async (req, res) => {
  const { user_id, subject, message, status, priority } = req.body;
  if (!user_id || !subject || !message) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('subject', sql.VarChar, subject)
      .input('message', sql.Text, message)
      .input('status', sql.VarChar, status || 'open')
      .input('priority', sql.VarChar, priority || 'normal')
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO support_tickets (user_id, subject, message, status, priority, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @subject, @message, @status, @priority, @created_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating support ticket:', error.message);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
};

const updateSupportTicket = async (req, res) => {
  const { id } = req.params;
  const { subject, message, status, priority, resolved_at } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (subject) fields.push('subject = @subject');
    if (message) fields.push('message = @message');
    if (status) fields.push('status = @status');
    if (priority) fields.push('priority = @priority');
    if (resolved_at) fields.push('resolved_at = @resolved_at');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE support_tickets SET ${fields.join(', ')} WHERE ticket_id = @ticket_id`;
    const request = pool.request().input('ticket_id', sql.Int, id);
    if (subject) request.input('subject', sql.VarChar, subject);
    if (message) request.input('message', sql.Text, message);
    if (status) request.input('status', sql.VarChar, status);
    if (priority) request.input('priority', sql.VarChar, priority);
    if (resolved_at) request.input('resolved_at', sql.DateTime, resolved_at);
    await request.query(updateQuery);
    const result = await pool.request().input('ticket_id', sql.Int, id).query('SELECT * FROM support_tickets WHERE ticket_id = @ticket_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Support ticket not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating support ticket:', error.message);
    res.status(500).json({ error: 'Failed to update support ticket' });
  }
};

const deleteSupportTicket = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('ticket_id', sql.Int, id).query('DELETE FROM support_tickets WHERE ticket_id = @ticket_id');
    res.json({ message: 'Support ticket deleted' });
  } catch (error) {
    console.error('Error deleting support ticket:', error.message);
    res.status(500).json({ error: 'Failed to delete support ticket' });
  }
};

module.exports = {
  getAllSupportTickets,
  getSupportTicketById,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket
}; 