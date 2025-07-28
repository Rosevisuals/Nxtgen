// controllers/patientsController.js - Patient Management Controller
const Patient = require('../models/patientModel');
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
  const { full_name, email, phone_number, gender, date_of_birth, address, doctor_id } = req.body;
  if (!full_name || !email || !phone_number || !gender || !date_of_birth || !doctor_id) {
    return res.status(400).json({ message: 'All patient details are required' });
  }

  try {
    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const newUser = await usersModel.createUser({
      full_Name: full_name,
      email,
      phone: phone_number,
      gender,
      DOB: date_of_birth,
      Address: address,
      status: 'pending_setup', // Awaiting initial password setup
      created_at: new Date(),
    });

    await Patient.create({
      // Note: We are not linking user_id here as the schema is unchanged
      full_name,
      date_of_birth,
      gender,
      phone_number,
      address,
      doctor_id,
    });

    const setupToken = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${setupToken}`;
    sendEmail({
      to: email,
      subject: 'Set Up Your Hospital Account Password',
      text: `Welcome to our hospital. Please set up your password by clicking this link: ${setupLink}`
    });

    res.status(201).json({
      message: 'Patient registered. A password setup link has been sent to their email.',
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
  const { full_name, email, password, phone_number, gender, date_of_birth, address } = req.body;
  if (!full_name || !email || !password || !phone_number || !gender || !date_of_birth) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  try {
    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersModel.createUser({
      full_Name: full_name,
      email,
      password_hash: hashedPassword,
      phone: phone_number,
      gender,
      DOB: date_of_birth,
      Address: address,
      status: 'pending_verification',
      created_at: new Date(),
    });

    await Patient.create({
      full_name,
      date_of_birth,
      gender,
      phone_number,
      address,
      doctor_id: null,
    });

    const verificationToken = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      text: `Thank you for registering. Please verify your email by clicking this link: ${verificationLink}`
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
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
