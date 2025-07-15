const { poolConnect, pool, sql } = require('../config/db');

// ===== REPORTS CRUD =====
const getAllReports = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT r.*, u.full_name AS user_name, u.email
      FROM reports r
      JOIN users u ON r.user_id = u.user_id
      ORDER BY r.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('report_id', sql.Int, id)
      .query('SELECT * FROM reports WHERE report_id = @report_id');
    const report = result.recordset[0];
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error.message);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

const createReport = async (req, res) => {
  const { user_id, title, content, type, status } = req.body;
  if (!user_id || !title || !content) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    await poolConnect;
    const now = new Date();
    const insertResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('title', sql.VarChar, title)
      .input('content', sql.Text, content)
      .input('type', sql.VarChar, type || 'general')
      .input('status', sql.VarChar, status || 'draft')
      .input('created_at', sql.DateTime, now)
      .query(`INSERT INTO reports (user_id, title, content, type, status, created_at)
        OUTPUT INSERTED.*
        VALUES (@user_id, @title, @content, @type, @status, @created_at)`);
    res.status(201).json(insertResult.recordset[0]);
  } catch (error) {
    console.error('Error creating report:', error.message);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

const updateReport = async (req, res) => {
  const { id } = req.params;
  const { title, content, type, status } = req.body;
  try {
    await poolConnect;
    const fields = [];
    if (title) fields.push('title = @title');
    if (content) fields.push('content = @content');
    if (type) fields.push('type = @type');
    if (status) fields.push('status = @status');
    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });
    const updateQuery = `UPDATE reports SET ${fields.join(', ')} WHERE report_id = @report_id`;
    const request = pool.request().input('report_id', sql.Int, id);
    if (title) request.input('title', sql.VarChar, title);
    if (content) request.input('content', sql.Text, content);
    if (type) request.input('type', sql.VarChar, type);
    if (status) request.input('status', sql.VarChar, status);
    await request.query(updateQuery);
    const result = await pool.request().input('report_id', sql.Int, id).query('SELECT * FROM reports WHERE report_id = @report_id');
    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating report:', error.message);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request().input('report_id', sql.Int, id).query('DELETE FROM reports WHERE report_id = @report_id');
    res.json({ message: 'Report deleted' });
  } catch (error) {
    console.error('Error deleting report:', error.message);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
}; 