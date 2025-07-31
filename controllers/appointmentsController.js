// controllers/appointmentsController.js - Appointments Management Controller

const Appointment = require('../models/appointmentsModel');

// ===== GET ALL APPOINTMENTS FUNCTION =====
const getAllAppointments = async (req, res) => {
  try {
    const { patient_id, status, staff_id } = req.query;
    let appointments = await Appointment.findAll();
    
    // Filter by patient_id if provided
    if (patient_id) {
      appointments = appointments.filter(apt => apt.patient_id == patient_id);
    }
    
    // Filter by status if provided
    if (status) {
      if (status === 'upcoming') {
        appointments = appointments.filter(apt => new Date(apt.appointment_date) > new Date());
      } else if (status === 'past') {
        appointments = appointments.filter(apt => new Date(apt.appointment_date) < new Date());
      } else {
        appointments = appointments.filter(apt => apt.status.toLowerCase() === status.toLowerCase());
      }
    }
    
    // Filter by staff_id if provided
    if (staff_id) {
      appointments = appointments.filter(apt => apt.staff_id == staff_id);
    }
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// ===== GET APPOINTMENT BY ID FUNCTION =====
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error.message);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

// ===== CREATE APPOINTMENT FUNCTION =====
const createAppointment = async (req, res) => {
  const { patient_id, staff_id, department_id, appointment_date, status, notes } = req.body;
  if (!patient_id || !staff_id || !department_id || !appointment_date || !status) {
    return res.status(400).json({ message: 'Required appointment data missing' });
  }
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error.message);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// ===== UPDATE APPOINTMENT FUNCTION =====
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAppointment = await Appointment.update(id, req.body);
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error.message);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// ===== DELETE APPOINTMENT FUNCTION =====
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Appointment.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error.message);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

// ===== GET PATIENT APPOINTMENTS =====
const getPatientAppointments = async (req, res) => {
  const { patient_id } = req.params;
  const { status } = req.query;
  
  try {
    let appointments = await Appointment.findAll();
    appointments = appointments.filter(apt => apt.patient_id == patient_id);
    
    if (status === 'upcoming') {
      appointments = appointments.filter(apt => new Date(apt.appointment_date) > new Date());
    } else if (status === 'past') {
      appointments = appointments.filter(apt => new Date(apt.appointment_date) < new Date());
    }
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error.message);
    res.status(500).json({ error: 'Failed to fetch patient appointments' });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatientAppointments
};
