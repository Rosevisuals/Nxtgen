const { validationResult } = require("express-validator");
const testTypeModel = require("../models/testTypesModel");

const getAllTestType = async (req, res) => {
  try {
    const result = await testTypeModel.getAllTestType();
    res.json(result);
  } catch (error) {
    console.error('Error fetching testtype:', error.message);
    res.status(500).json({ error: 'Failed to fetch testtype' });
  }
};

const getTestTypeById = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    const testType = await testTypeModel.getTestTypeById(parseInt(id));
    if (!testType) return res.status(404).json({ message: 'TestType not found' });
    res.json(testType);
  } catch (error) {
    console.error('Error fetching testtype:', error.message);
    res.status(500).json({ error: 'Failed to fetch testtype' });
  }
};

const createTestType = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { Name_of_test } = req.body;
  try {
    const newTestType = await testTypeModel.createTestType({ Name_of_test });
    res.status(201).json(newTestType);
  } catch (error) {
    console.error('Error creating testtype:', error.message);
    res.status(500).json({ error: 'Failed to create testtype' });
  }
};

const updateTestType = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  const { Name_of_test } = req.body;
  try {
    const updatedTestType = await testTypeModel.updateTestType(parseInt(id), { Name_of_test });
    if (!updatedTestType) {
      return res.status(404).json({ message: 'TestType not found' });
    }
    res.json(updatedTestType);
  } catch (error) {
    console.error('Error updating testtype:', error.message);
    res.status(500).json({ error: 'Failed to update testtype' });
  }
};

const deleteTestType = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    await testTypeModel.deleteTestType(parseInt(id));
    res.json({ message: 'TestType deleted' });
  } catch (error) {
    console.error('Error deleting testtype:', error.message);
    res.status(500).json({ error: 'Failed to delete testtype' });
  }
};

module.exports = {
  createTestType,
  deleteTestType,
  getAllTestType,
  getTestTypeById,
  updateTestType
}; 