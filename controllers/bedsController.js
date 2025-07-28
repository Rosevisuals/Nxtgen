const { validationResult } = require("express-validator");
const bedsModel = require("../models/bedsModel");

const getAllBeds = async (req, res) => {
  try {
    const result = await bedsModel.getAllBeds();
    res.json(result);
  } catch (error) {
    console.error('Error fetching beds:', error.message);
    res.status(500).json({ error: 'Failed to fetch beds' });
  }
};

const getBedById = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    const bed = await bedsModel.getBedById(parseInt(id));
    if (!bed) return res.status(404).json({ message: 'Bed not found' });
    res.json(bed);
  } catch (error) {
    console.error('Error fetching bed:', error.message);
    res.status(500).json({ error: 'Failed to fetch bed' });
  }
};

const createBed = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const {
    patient_id,
    bed_number,
    status,
    ward_id } = req.body;
  if (!bed_number) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const newBed = await bedsModel.createBed({
      patient_id,
      bed_number,
      status,
      ward_id
    });
    res.status(201).json(newBed);
  } catch (error) {
    console.error('Error creating bed:', error.message);
    res.status(500).json({ error: 'Failed to create bed' });
  }
};

const updateBed = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  const {
    patient_id,
    bed_number,
    status,
    ward_id } = req.body;
  try {
    const updatedBed = await bedsModel.updateBed(parseInt(id), {
      patient_id,
      bed_number,
      status,
      ward_id
    });
    if (!updatedBed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json(updatedBed);
  } catch (error) {
    console.error('Error updating bed:', error.message);
    res.status(500).json({ error: 'Failed to update bed' });
  }
};

const deleteBed = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    await bedsModel.deleteBed(parseInt(id));
    res.json({ message: 'Bed deleted' });
  } catch (error) {
    console.error('Error deleting bed:', error.message);
    res.status(500).json({ error: 'Failed to delete bed' });
  }
};

module.exports = {
  createBed,
  deleteBed,
  getAllBeds,
  getBedById,
  updateBed
}; 