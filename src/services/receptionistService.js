// src/services/receptionistService.js
import { apiFetch } from '../utils/api';

export const registerPatient = async (patientData) => {
  console.log('Registering patient via staff:', patientData);
  return await apiFetch('/patients/create', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
};

export const getTodayAppointments = async () => {
  const appointments = await apiFetch('/appointments');
  const today = new Date().toISOString().split('T')[0];
  return appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date).toISOString().split('T')[0];
    return aptDate === today;
  });
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  return await apiFetch(`/appointments/${appointmentId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const getAllPatients = async () => {
  return await apiFetch('/patients');
};

export const searchPatients = async (searchTerm) => {
  return await apiFetch(`/patients?search=${encodeURIComponent(searchTerm)}`);
};