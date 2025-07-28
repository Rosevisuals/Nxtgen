const { validationResult } = require("express-validator");
const conditionsModel = require("../models/conditionsModel");

const getAllConditions = async (req, res) => {
  try {
    const result = await conditionsModel.getAllConditions();
    res.json(result);
  } catch (error) {
    console.error('Error fetching condition:', error.message);
    res.status(500).json({ error: 'Failed to fetch condition' });
  }
};

const getConditionById = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    const condition = await conditionsModel.getConditionById(parseInt(id));
    if (!condition) return res.status(404).json({ message: 'Condition not found' });
    res.json(condition);
  } catch (error) {
    console.error('Error fetching condition:', error.message);
    res.status(500).json({ error: 'Failed to fetch condition' });
  }
};

const createCondition = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { Name, Description, Status } = req.body;
  if (!Name) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const newCondition = await conditionsModel.createCondition({ Name, Description, Status });
    res.status(201).json(newCondition);
  } catch (error) {
    console.error('Error creating condition:', error.message);
    res.status(500).json({ error: 'Failed to create condition' });
  }
};

const updateCondition = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  const { Name, Description, Status } = req.body;
  try {
    const updatedCondition = await conditionsModel.updateCondition(parseInt(id), { Name, Description, Status });
    if (!updatedCondition) {
      return res.status(404).json({ message: 'Condition not found' });
    }
    res.json(updatedCondition);
  } catch (error) {
    console.error('Error updating condition:', error.message);
    res.status(500).json({ error: 'Failed to update condition' });
  }
};

const deleteCondition = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }
  const { id } = req.params;
  try {
    await conditionsModel.deleteCondition(parseInt(id));
    res.json({ message: 'Condition deleted' });
  } catch (error) {
    console.error('Error deleting condition:', error.message);
    res.status(500).json({ error: 'Failed to delete condition' });
  }
};

module.exports = {
  createCondition,
  deleteCondition,
  getAllConditions,
  getConditionById,
  updateCondition
}; 