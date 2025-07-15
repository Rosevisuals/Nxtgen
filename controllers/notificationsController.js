const { poolConnect, pool, sql } = require('../config/db');

// ===== NOTIFICATIONS CRUD =====
const getAllNotifications = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT n.*, u.full_name AS user_name, u.email
      FROM notifications n
      JOIN users u ON n.user_id = u.user_id
      ORDER BY n.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('notification_id', sql.Int, id)
      .query('SELECT * FROM notifications WHERE notification_id = @notification_id');
    const notification = result.recordset[0];
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error.message);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

const createNotification = async (req, res) => {
  const { user_id, title, message, type, status } = req.body;
  if (!user_id || !title || !message) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('title', sql.VarChar, title)
      .input('message', sql.Text, message)
      .input('type', sql.VarChar, type || 'info')
      .input('status', sql.VarChar, status || 'unread')
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO notifications (user_id, title, message, type, status, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @title, @message, @type, @status, @created_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating notification:', error.message);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { title, message, type, status, read_at } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (title) fields.push('title = @title');
    if (message) fields.push('message = @message');
    if (type) fields.push('type = @type');
    if (status) fields.push('status = @status');
    if (read_at) fields.push('read_at = @read_at');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE notifications SET ${fields.join(', ')} WHERE notification_id = @notification_id`;
    const request = pool.request().input('notification_id', sql.Int, id);
    if (title) request.input('title', sql.VarChar, title);
    if (message) request.input('message', sql.Text, message);
    if (type) request.input('type', sql.VarChar, type);
    if (status) request.input('status', sql.VarChar, status);
    if (read_at) request.input('read_at', sql.DateTime, read_at);
    await request.query(updateQuery);
    const result = await pool.request().input('notification_id', sql.Int, id).query('SELECT * FROM notifications WHERE notification_id = @notification_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating notification:', error.message);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('notification_id', sql.Int, id).query('DELETE FROM notifications WHERE notification_id = @notification_id');
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
}; 