// controllers/patientsController.js - Patient Management Controller
// This file handles all operations related to patients (create, read, update, delete)
// Think of this as the "patient records office" where all patient information is managed

// Import the Patient model
const Patient = require('../models/patientModel');

// ===== GET ALL PATIENTS FUNCTION =====
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// ===== GET PATIENT BY ID FUNCTION =====
const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error.message);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

// ===== CREATE PATIENT FUNCTION =====
const createPatient = async (req, res) => {
  const { full_name, date_of_birth, gender, phone_number, address, doctor_id } = req.body;
  if (!full_name || !date_of_birth || !gender || !phone_number || !doctor_id) {
    return res.status(400).json({ message: 'Required patient data missing' });
  }
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error.message);
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

// ===== UPDATE PATIENT FUNCTION =====
const updatePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPatient = await Patient.update(id, req.body);
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error.message);
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

// ===== DELETE PATIENT FUNCTION =====
const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Patient.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error.message);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};

// Export all functions so they can be used in route files
module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
