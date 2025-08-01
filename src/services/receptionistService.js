// src/services/receptionistService.js
import { apiFetch } from '../utils/api';

export const registerPatient = async (patientData) => {
  console.log(patientData);
  return await apiFetch('/patients/create', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
};

export const getTodayAppointments = async () => {
  const today = new Date().toISOString().split('T')[0];
  return await apiFetch(`/appointments?date=${today}`);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  return await apiFetch(`/appointments/${appointmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};