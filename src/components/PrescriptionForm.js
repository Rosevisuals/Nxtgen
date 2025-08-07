import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserInjured, FaPrescriptionBottleAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../utils/api';
import './centered-layout.css';



// Diagnosis options
const diagnosisOptions = [
  { value: 'Hypertension', label: 'Hypertension' },
  { value: 'Type 2 Diabetes', label: 'Type 2 Diabetes' },
  { value: 'Acute Bronchitis', label: 'Acute Bronchitis' },
  { value: 'Influenza', label: 'Influenza' },
  { value: 'Urinary Tract Infection', label: 'Urinary Tract Infection' },
  { value: 'Gastroenteritis', label: 'Gastroenteritis' },
  { value: 'Migraine', label: 'Migraine' },
  { value: 'Anxiety Disorder', label: 'Anxiety Disorder' },
  { value: 'Depression', label: 'Depression' },
  { value: 'Asthma', label: 'Asthma' },
  { value: 'Allergic Rhinitis', label: 'Allergic Rhinitis' },
  { value: 'Osteoarthritis', label: 'Osteoarthritis' },
  { value: 'Gastroesophageal Reflux Disease', label: 'Gastroesophageal Reflux Disease' },
  { value: 'Other', label: 'Other (Specify in Notes)' },
];

// Medication options
const medicationOptions = [
  { value: 'Lisinopril', label: 'Lisinopril' },
  { value: 'Metformin', label: 'Metformin' },
  { value: 'Atorvastatin', label: 'Atorvastatin' },
  { value: 'Amlodipine', label: 'Amlodipine' },
  { value: 'Metoprolol', label: 'Metoprolol' },
  { value: 'Omeprazole', label: 'Omeprazole' },
  { value: 'Albuterol', label: 'Albuterol' },
  { value: 'Gabapentin', label: 'Gabapentin' },
  { value: 'Hydrochlorothiazide', label: 'Hydrochlorothiazide' },
  { value: 'Sertraline', label: 'Sertraline' },
  { value: 'Amoxicillin', label: 'Amoxicillin' },
  { value: 'Azithromycin', label: 'Azithromycin' },
  { value: 'Ibuprofen', label: 'Ibuprofen' },
  { value: 'Acetaminophen', label: 'Acetaminophen' },
  { value: 'Other', label: 'Other (Specify in Instructions)' },
];

// Frequency options
const frequencyOptions = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily' },
  { value: 'Three times daily', label: 'Three times daily' },
  { value: 'Four times daily', label: 'Four times daily' },
  { value: 'Every 4 hours', label: 'Every 4 hours' },
  { value: 'Every 6 hours', label: 'Every 6 hours' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
  { value: 'Every 12 hours', label: 'Every 12 hours' },
  { value: 'As needed', label: 'As needed (PRN)' },
  { value: 'Other', label: 'Other (Specify in Instructions)' },
];

// Duration options
const durationOptions = [
  { value: '3 days', label: '3 days' },
  { value: '5 days', label: '5 days' },
  { value: '7 days', label: '7 days' },
  { value: '10 days', label: '10 days' },
  { value: '14 days', label: '14 days' },
  { value: '30 days', label: '30 days' },
  { value: '60 days', label: '60 days' },
  { value: '90 days', label: '90 days' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Other', label: 'Other (Specify in Instructions)' },
];

/**
 * PrescriptionForm Component
 * Form for doctors to create new prescriptions.
 * @returns {JSX.Element} The prescription form component
 */
const PrescriptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  // Form state
  /**
   * @typedef {Object} Medication
   * @property {string} name - Medication name
   * @property {string} dosage - Dosage (e.g., 10mg)
   * @property {string} frequency - Frequency (e.g., Once daily)
   * @property {string} duration - Duration (e.g., 7 days)
   * @property {string} instructions - Special instructions
   */
  /**
   * @typedef {Object} FormData
   * @property {string} patientId - Patient ID
   * @property {Date} date - Prescription date
   * @property {string} diagnosis - Diagnosis
   * @property {string} notes - Additional notes
   * @property {Medication[]} medications - List of medications
   */
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    date: new Date(),
    diagnosis: '',
    notes: '',
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ],
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        if (patientId) {
          const patientsData = await apiFetch('/patients');
          const patientData = patientsData?.find(p => p.patient_id.toString() === patientId);
          
          if (patientData) {
            const formattedPatient = {
              id: patientData.patient_id,
              name: patientData.full_Name,
              age: patientData.DOB ? new Date().getFullYear() - new Date(patientData.DOB).getFullYear() : 0,
              gender: patientData.gender === 'M' ? 'Male' : patientData.gender === 'F' ? 'Female' : 'Other',
              dob: patientData.DOB,
              allergies: [],
              chronicConditions: [],
            };
            setPatient(formattedPatient);
          } else {
            setPatient(null);
          }
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast.error('Failed to load patient data');
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Format date to YYYY-MM-DD for API submission
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle medication input change
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  // Handle add medication
  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ],
    });
  };

  // Handle remove medication
  const handleRemoveMedication = (index) => {
    if (formData.medications.length === 1) {
      toast.warn('At least one medication is required.');
      return;
    }
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];

    if (!formData.diagnosis) errors.push('Diagnosis is required.');
    if (!formData.date) errors.push('Prescription Date is required.');

    formData.medications.forEach((med, index) => {
      if (!med.name) errors.push(`Medication ${index + 1}: Name is required.`);
      if (!med.dosage || !/^\d{1,3}(\.\d)?\s?(mg|g|ml|tab|cap)$/i.test(med.dosage)) {
        errors.push(`Medication ${index + 1}: Dosage must be valid (e.g., 10mg, 500mg, 1tab).`);
      }
      if (!med.frequency) errors.push(`Medication ${index + 1}: Frequency is required.`);
      if (!med.duration) errors.push(`Medication ${index + 1}: Duration is required.`);
    });

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    // Prepare data for API
    const submissionData = {
      ...formData,
      date: formatDate(formData.date),
    };

    try {
      // Save prescription to database
      const prescriptionData = {
        patient_id: parseInt(patientId),
        staff_id: parseInt(localStorage.getItem('staff_id') || '1007'),
        DiagnosisID: null, // No diagnosis required
        medication: formData.medications.map(med => med.name).join(', '),
        dosage: formData.medications.map(med => `${med.name}: ${med.dosage} ${med.frequency} for ${med.duration}`).join('; '),
        date_issued: submissionData.date,
        notes: formData.notes
      };
      
      await apiFetch('/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });
      
      toast.success('Prescription saved successfully!');
      setTimeout(() => {
        navigate('/DoctorsDashboard');
      }, 1000);
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    toast.info('Prescription cancelled');
    navigate('/DoctorsDashboard');
  };

  if (loading) {
    return (
      <div className="prescription-form loading">
        <p className="text-center text-gray-500">Loading patient information...</p>
      </div>
    );
  }

  if (patientId && !patient) {
    return (
      <div className="centered-container">
        <div className="centered-content">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="text-red-600">Patient Not Found</h1>
              <p>The patient with ID {patientId} could not be found.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/PatientLookup')}
              >
                Back to Patient Lookup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="centered-content">
        <div className="page-header">
          <h1 className="page-title">
            <FaPrescriptionBottleAlt /> New Prescription
          </h1>
          <p className="page-subtitle">Create prescription for patient</p>
        </div>

        {patient && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FaUserInjured /> Patient Information
              </h2>
            </div>
            <div className="card-body">
              <div className="patient-info">
                <h3 className="patient-name">{patient.name}</h3>
                <div className="patient-details">
                  <span>{patient.age} years</span>
                  <span>{patient.gender}</span>
                  <span>ID: {patient.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Prescription Details</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Prescription Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Diagnosis</label>
                <select
                  className="form-input"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Diagnosis</option>
                  {diagnosisOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the prescription"
                  rows={3}
                />
              </div>

              <div className="medications-section full-width">
                <h3 className="section-title">
                  <FaPrescriptionBottleAlt /> Medications
                </h3>
                
                {formData.medications.map((medication, index) => (
                  <div key={index} className="medication-card">
                    <div className="medication-header">
                      <h4>Medication {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(index)}
                        disabled={formData.medications.length === 1}
                        className="btn btn-secondary btn-sm"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Medication Name</label>
                        <select
                          className="form-input"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          required
                        >
                          <option value="">Select Medication</option>
                          {medicationOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Dosage</label>
                        <input
                          type="text"
                          className="form-input"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          placeholder="e.g., 10mg"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Frequency</label>
                        <select
                          className="form-input"
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          required
                        >
                          <option value="">Select Frequency</option>
                          {frequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <select
                          className="form-input"
                          value={medication.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          required
                        >
                          <option value="">Select Duration</option>
                          {durationOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group full-width">
                        <label className="form-label">Special Instructions</label>
                        <input
                          type="text"
                          className="form-input"
                          value={medication.instructions}
                          onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          placeholder="e.g., Take with food"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="btn btn-outline"
                >
                  <FaPlus /> Add Another Medication
                </button>
              </div>

              <div className="form-actions full-width">
                <button type="submit" className="btn btn-success" style={{marginRight: '0.5rem'}}>
                  Save Prescription
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;