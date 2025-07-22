// controllers/prescriptionsController.js - Prescriptions Management Controller

const Prescription = require('../models/prescriptionsModel');

// ===== GET ALL PRESCRIPTIONS FUNCTION =====
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll();
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

// ===== GET PRESCRIPTION BY ID FUNCTION =====
const getPrescriptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error.message);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
};

// ===== CREATE PRESCRIPTION FUNCTION =====
const createPrescription = async (req, res) => {
  const { patient_id, doctor_id, medication, dosage, frequency, start_date, end_date } = req.body;
  if (!patient_id || !doctor_id || !medication || !dosage || !frequency || !start_date || !end_date) {
    return res.status(400).json({ message: 'Required prescription data missing' });
  }
  try {
    const newPrescription = await Prescription.create(req.body);
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error.message);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

// ===== UPDATE PRESCRIPTION FUNCTION =====
const updatePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPrescription = await Prescription.update(id, req.body);
    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(updatedPrescription);
  } catch (error) {
    console.error('Error updating prescription:', error.message);
    res.status(500).json({ error: 'Failed to update prescription' });
  }
};

// ===== DELETE PRESCRIPTION FUNCTION =====
const deletePrescription = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Prescription.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error.message);
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
};