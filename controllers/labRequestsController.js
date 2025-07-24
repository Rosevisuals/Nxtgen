const { validationResult } = require("express-validator");
const labRequestModel = require("../models/labRequestsModel");

const getAllLabRequests = async (req, res) => {
  try {
    const result = await labRequestModel.getAllLabRequests();
    res.json(result);
  } catch (error) {
    console.error('Error fetching labrequest:', error.message);
    res.status(500).json({ error: 'Failed to fetch labrequest' });
  }
};

const getLabRequestById = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    const labRequest = await labRequestModel.getLabRequestById(parseInt(id));
    if (!labRequest) return res.status(404).json({ message: 'LabRequest not found' });
    res.json(labRequest);
  } catch (error) {
    console.error('Error fetching labrequest:', error.message);
    res.status(500).json({ error: 'Failed to fetch labrequest' });
  }
};

const createLabRequest = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const {
    patient_id,
    doctor_id,
    test_id,
    technician_id,
    date_conducted,
    notes,
    results
  } = req.body;
  if (!patient_id || !doctor_id || !test_id) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const newLabRequest = await labRequestModel.createLabRequest({
      patient_id,
      doctor_id,
      test_id,
      technician_id,
      date_conducted,
      notes,
      results
    });
    res.status(201).json(newLabRequest);
  } catch (error) {
    console.error('Error creating labrequest:', error.message);
    res.status(500).json({ error: 'Failed to create labrequest' });
  }
};

const updateLabRequest = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  const {
    patient_id,
    doctor_id,
    test_id,
    technician_id,
    date_conducted,
    notes,
    results
  } = req.body;
  try {
    const updatedLabRequest = await labRequestModel.updateLabRequest(parseInt(id), {
      patient_id,
      doctor_id,
      test_id,
      technician_id,
      date_conducted,
      notes,
      results
    });
    if (!updatedLabRequest) {
      return res.status(404).json({ message: 'LabRequest not found' });
    }
    res.json(updatedLabRequest);
  } catch (error) {
    console.error('Error updating labrequest:', error.message);
    res.status(500).json({ error: 'Failed to update labrequest' });
  }
};

const deleteLabRequest = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    await labRequestModel.deleteLabRequest(parseInt(id));
    res.json({ message: 'LabRequest deleted' });
  } catch (error) {
    console.error('Error deleting labrequest:', error.message);
    res.status(500).json({ error: 'Failed to delete labrequest' });
  }
};

module.exports = {
  createLabRequest,
  deleteLabRequest,
  getAllLabRequests,
  getLabRequestById,
  updateLabRequest
}; 