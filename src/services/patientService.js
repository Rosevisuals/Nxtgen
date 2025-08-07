// src/services/patientService.js
import { apiFetch } from '../utils/api';

export const getPatientById = async (patientId) => {
  return await apiFetch(`/patients/${patientId}`);
};

export const getPatientByUserId = async (userId) => {
  return await apiFetch(`/patients/user/${userId}`);
};

export const getPatientAppointments = async (patientId) => {
  try {
    // Try to get patient-specific appointments first
    const data = await apiFetch(`/patients/${patientId}/appointments`);
    console.log(data);
    
    return data
  } catch (error) {
    console.log('Patient-specific endpoint failed, filtering all appointments');
    // Fallback: get all appointments and filter by patient_id
    const allAppointments = await apiFetch(`/appointments`);
    console.log(allAppointments);

    return allAppointments?.filter(appointment => 
      appointment.patient_id === patientId
    ) || [];
  }
};

export const getPatientPrescriptions = async (patientId) => {
  try {
    // Try the prescriptions endpoint first
    return await apiFetch(`/prescriptions/patient/${patientId}`);
  } catch (error) {
    console.log('Prescriptions endpoint failed, trying patients endpoint');
    // Fallback to patients endpoint
    return await apiFetch(`/patients/${patientId}/prescriptions`);
  }
};

export const updatePatient = async (patientId, patientData) => {
  return await apiFetch(`/patients/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(patientData),
  });
};