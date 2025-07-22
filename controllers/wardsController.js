const wardsModel = require("../models/wardsModel");

const createWard = async (req, res) => {
  const { Department_id, ward_number, ward_type } = req.body;
  if (!ward_number) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const newWard = await wardsModel.createWard({ Department_id, ward_number, ward_type });
    return res.status(201).json(newWard);
  } catch (error) {
    console.error('Error creating ward:', error.message);
    res.status(500).json({ error: 'Failed to create ward' });
  }
};

const deleteWard = async (req, res) => {
  const { id } = req.params;
  try {
    if (await wardsModel.deleteWard(id)) return res.json({ message: 'Ward deleted' });
    else return res.json({ message: 'Failed to delete ward' });
  } catch (error) {
    console.error('Error deleting ward:', error.message);
    res.status(500).json({ error: 'Failed to delete ward' });
  }
};

const getAllWards = async (req, res) => {
  try {
    return res.json(await wardsModel.getAllWards());
  } catch (error) {
    console.error('Error fetching ward:', error.message);
    res.status(500).json({ error: 'Failed to fetch ward' });
  }
};

const getWardById = async (req, res) => {
  const { id } = req.params;
  try {
    const ward = await wardsModel.getWardById(parseInt(id));
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    else return res.json(ward);
  } catch (error) {
    console.error('Error fetching ward:', error.message);
    res.status(500).json({ error: 'Failed to fetch ward' });
  }
};

const updateWard = async (req, res) => {
  const { id } = req.params;
  const { Department_id, ward_number, ward_type } = req.body;
  try {
    const updatedWard = await wardsModel.updateWard(parseInt(id), { Department_id, ward_number, ward_type });
    if (!updatedWard) return res.status(404).json({ message: 'Ward not found' });
    else return res.json(updatedWard);
  } catch (error) {
    console.error('Error updating ward:', error.message);
    res.status(500).json({ error: 'Failed to update ward' });
  }
};

module.exports = {
  createWard,
  deleteWard,
  getAllWards,
  getWardById,
  updateWard
}; 