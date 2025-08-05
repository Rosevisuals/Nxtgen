// src/services/patientService.js
import { apiFetch } from '../utils/api';

export const getPatientById = async (patientId) => {
  return await apiFetch(`/patients/${patientId}`);
};

export const getPatientByUserId = async (userId) => {
  return await apiFetch(`/patients/user/${userId}`);
};

export const getPatientAppointments = async (patientId) => {
  // return await apiFetch(`/patients/${patientId}/appointments`);
  return await apiFetch(`/appointments`);
};

export const getPatientPrescriptions = async (patientId) => {
  return await apiFetch(`/patients/${patientId}/prescriptions`);
};

export const updatePatient = async (patientId, patientData) => {
  return await apiFetch(`/patients/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(patientData),
  });
};