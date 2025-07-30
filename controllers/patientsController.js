// controllers/patientsController.js - Patient Management Controller
const { Patient, registerPatient: registerPatientModel } = require('../models/patientModel');
const usersModel = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
require('dotenv').config();

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

// ===== CREATE PATIENT FUNCTION (In-Person by Staff) =====
const createPatient = async (req, res) => {
  const {
    full_Name,
    email,
    phone,
    gender,
    DOB,
    marital_status,
    Address,
    blood_group,
    BMI,
    NOTES,
    emergency_contact
  } = req.body;

  // Validate required fields
  if (!full_Name || !email || !phone || !gender || !DOB) {
    return res.status(400).json({ message: 'All required patient details must be provided' });
  }

  try {
    // Check if user already exists
    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // Prepare complete patient data for staff creation
    const patientData = {
      // User fields
      full_Name,
      email,
      password_hash: null, // No password for staff-created patients initially
      phone,
      gender,
      DOB,
      marital_status: marital_status || 'Single',
      Address: Address || '',
      status: 'pending_setup', // Awaiting initial password setup
      // Patient fields
      blood_group: blood_group || null,
      BMI: BMI || null,
      NOTES: NOTES || 'Created by staff',
      emergency_contact: emergency_contact || phone
    };

    // Use the combined registration function
    const newPatient = await registerPatientModel(patientData);

    // Generate setup token for password creation
    const setupToken = jwt.sign({ user_id: newPatient.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${setupToken}`;

    // Send setup email
    sendEmail({
      to: email,
      subject: 'Set Up Your Hospital Account Password',
      text: `Welcome to our hospital. Please set up your password by clicking this link: ${setupLink}`
    });

    res.status(201).json({
      message: 'Patient registered by staff. A password setup link has been sent to their email.',
      patient: {
        patient_id: newPatient.patient_id,
        full_Name: newPatient.full_Name,
        email: newPatient.email,
        phone: newPatient.phone,
        status: newPatient.status
      }
    });

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

// ===== REGISTER PATIENT FUNCTION (Online Self-Registration) =====
const registerPatient = async (req, res) => {
  const {
    full_Name,
    email,
    password,
    phone,
    gender,
    DOB,
    marital_status,
    Address,
    blood_group,
    BMI,
    NOTES,
    emergency_contact
  } = req.body;

  // Validate required fields
  if (!full_Name || !email || !password || !phone || !gender || !DOB) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  try {
    // Check if user already exists
    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare complete patient data
    const patientData = {
      // User fields
      full_Name,
      email,
      password_hash: hashedPassword,
      phone,
      gender,
      DOB,
      marital_status: marital_status || 'Single',
      Address: Address || '',
      status: 'inactive',
      // Patient fields
      blood_group: blood_group || null,
      BMI: BMI || null,
      NOTES: NOTES || '',
      emergency_contact: emergency_contact || phone
    };

    // Use the new combined registration function
    const newPatient = await registerPatientModel(patientData);

    // Generate verification token
    const verificationToken = jwt.sign({ user_id: newPatient.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      text: `Thank you for registering. Please verify your email by clicking this link: ${verificationLink}`
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      patient: {
        patient_id: newPatient.patient_id,
        full_Name: newPatient.full_Name,
        email: newPatient.email,
        status: newPatient.status
      }
    });

  } catch (error) {
    console.error('Error during patient self-registration:', error.message);
    res.status(500).json({ error: 'Failed to register patient' });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  registerPatient,
};
