const diagnosesModel = require("../models/diagnosesModel");

const getAllDiagnoses = async (req, res) => {
  try {
    const result = await diagnosesModel.getAllDiagnoses();
    res.json(result);
  } catch (error) {
    console.error('Error fetching diagnosis:', error.message);
    res.status(500).json({ error: 'Failed to fetch diagnosis' });
  }
};

const getDiagnosisById = async (req, res) => {
  const { id } = req.params;
  try {
    const diagnosis = await diagnosesModel.getDiagnosisById(parseInt(id));
    if (!diagnosis) return res.status(404).json({ message: 'Diagnosis not found' });
    res.json(diagnosis);
  } catch (error) {
    console.error('Error fetching diagnosis:', error.message);
    res.status(500).json({ error: 'Failed to fetch diagnosis' });
  }
};

const createDiagnosis = async (req, res) => {
  const {
    patient_id,
    doctor_id,
    ConditionID,
    Symptoms,
    DiagnosisNote,
    DiagnosisDate,
    requestdate
  } = req.body;
  if (!patient_id || !doctor_id || !ConditionID) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  try {
    const newDiagnosis = await diagnosesModel.createDiagnosis({
      patient_id,
      doctor_id,
      ConditionID,
      Symptoms,
      DiagnosisNote,
      DiagnosisDate: DiagnosisDate ?? new Date().toISOString(),
      requestdate: requestdate ?? new Date().toISOString()
    });
    res.status(201).json(newDiagnosis);
  } catch (error) {
    console.error('Error creating diagnosis:', error.message);
    res.status(500).json({ error: 'Failed to create diagnosis' });
  }
};

const updateDiagnosis = async (req, res) => {
  const { id } = req.params;
  const {
    patient_id,
    doctor_id,
    ConditionID,
    Symptoms,
    DiagnosisNote,
    DiagnosisDate,
    requestdate
  } = req.body;
  try {
    const updatedDiagnosis = await diagnosesModel.updateDiagnosis(parseInt(id), {
      patient_id,
      doctor_id,
      ConditionID,
      Symptoms,
      DiagnosisNote,
      DiagnosisDate,
      requestdate
    });
    if (!updatedDiagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }
    res.json(updatedDiagnosis);
  } catch (error) {
    console.error('Error updating diagnosis:', error.message);
    res.status(500).json({ error: 'Failed to update diagnosis' });
  }
};

const deleteDiagnosis = async (req, res) => {
  const { id } = req.params;
  try {
    await diagnosesModel.deleteDiagnosis(parseInt(id));
    res.json({ message: 'Diagnosis deleted' });
  } catch (error) {
    console.error('Error deleting diagnosis:', error.message);
    res.status(500).json({ error: 'Failed to delete diagnosis' });
  }
};

module.exports = {
  createDiagnosis,
  deleteDiagnosis,
  getAllDiagnoses,
  getDiagnosisById,
  updateDiagnosis
}; 