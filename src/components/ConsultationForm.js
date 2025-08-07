import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserInjured, FaHeartbeat, FaWeight, FaTemperatureHigh, FaNotesMedical } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../utils/api';
import './centered-layout.css';

const mockPatients = {
  'P-10025': {
    id: 'P-10025',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    dob: '1980-05-15',
    bloodType: 'O+',
    height: '5\'10"',
    weight: '180 lbs',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    lastVitalSigns: {
      bloodPressure: '130/85',
      heartRate: '75',
      temperature: '98.6°F',
      respiratoryRate: '16',
      oxygenSaturation: '98%',
      weight: '180',
      height: '5\'10"',
    },
  },
  'P-10032': {
    id: 'P-10032',
    name: 'Jane Smith',
    age: 38,
    gender: 'Female',
    dob: '1987-08-22',
    bloodType: 'A+',
    height: '5\'6"',
    weight: '140 lbs',
    allergies: ['Sulfa drugs'],
    chronicConditions: [],
    lastVitalSigns: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6°F',
      respiratoryRate: '16',
      oxygenSaturation: '99%',
      weight: '140',
      height: '5\'6"',
    },
  },
};

const mockAppointments = {
  '1': {
    id: 1,
    patientId: 'P-10025',
    patientName: 'John Doe',
    time: '09:00 AM',
    date: new Date(),
    type: 'Check-up',
    status: 'Scheduled',
    notes: 'Follow-up on heart medication',
  },
  '2': {
    id: 2,
    patientId: 'P-10032',
    patientName: 'Jane Smith',
    time: '10:30 AM',
    date: new Date(),
    type: 'New Patient',
    status: 'Checked In',
    notes: 'First visit, complaining of chest pain',
  },
};

// Diagnosis and lab test options
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

const labTestOptions = [
  { value: 'Complete Blood Count', label: 'Complete Blood Count (CBC)' },
  { value: 'Basic Metabolic Panel', label: 'Basic Metabolic Panel (BMP)' },
  { value: 'Comprehensive Metabolic Panel', label: 'Comprehensive Metabolic Panel (CMP)' },
  { value: 'Lipid Panel', label: 'Lipid Panel' },
  { value: 'Liver Function Tests', label: 'Liver Function Tests (LFTs)' },
  { value: 'Thyroid Function Tests', label: 'Thyroid Function Tests (TFTs)' },
  { value: 'Hemoglobin A1C', label: 'Hemoglobin A1C' },
  { value: 'Urinalysis', label: 'Urinalysis' },
  { value: 'Urine Culture', label: 'Urine Culture' },
  { value: 'Chest X-ray', label: 'Chest X-ray' },
  { value: 'Electrocardiogram', label: 'Electrocardiogram (ECG/EKG)' },
  { value: 'Other', label: 'Other (Specify in Notes)' },
];

/**
 * ConsultationForm Component
 * Form for doctors to record consultation notes.
 * @returns {JSX.Element} The consultation form component
 */
const ConsultationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  const appointmentId = queryParams.get('appointmentId');

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    appointmentId: appointmentId || '',
    date: new Date(),
    chiefComplaint: '',
    history: '',
    examination: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
    },
    diagnosis: '',
    treatment: '',
    medications: '',
    labTests: '',
    followUpDate: null,
    followUpNotes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patient data
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
              bloodType: patientData.blood_group || '',
              allergies: [],
              chronicConditions: [],
              lastVitalSigns: {
                bloodPressure: '',
                heartRate: '',
                temperature: '',
                respiratoryRate: '',
                oxygenSaturation: '',
                weight: '',
                height: '',
              },
            };
            setPatient(formattedPatient);
          } else {
            setPatient(null);
          }
        }

        // Fetch appointment data
        if (appointmentId) {
          const appointmentsData = await apiFetch('/appointments');
          const appointmentData = appointmentsData?.find(a => a.appointment_id.toString() === appointmentId);
          
          if (appointmentData) {
            setAppointment(appointmentData);
            setFormData((prevData) => ({
              ...prevData,
              chiefComplaint: appointmentData.notes || '',
            }));
          } else {
            setAppointment(null);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, appointmentId]);

  // Format date to YYYY-MM-DD
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

  // Handle vital signs input change
  const handleVitalSignsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      vitalSigns: {
        ...formData.vitalSigns,
        [name]: value,
      },
    });
  };



  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];

    if (!formData.chiefComplaint) errors.push('Chief Complaint is required.');
    if (!formData.examination) errors.push('Examination is required.');
    if (!formData.diagnosis) errors.push('Diagnosis is required.');
    if (!formData.treatment) errors.push('Treatment Plan is required.');

    // Vital signs validation
    if (formData.vitalSigns.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(formData.vitalSigns.bloodPressure)) {
      errors.push('Blood Pressure must be in the format XXX/YY (e.g., 120/80).');
    }
    if (formData.vitalSigns.heartRate && !/^\d{1,3}$/.test(formData.vitalSigns.heartRate)) {
      errors.push('Heart Rate must be a number (e.g., 72).');
    }
    if (formData.vitalSigns.temperature && !/^\d{1,3}(\.\d)?°?F?$/.test(formData.vitalSigns.temperature)) {
      errors.push('Temperature must be a number (e.g., 98.6°F).');
    }
    if (formData.vitalSigns.respiratoryRate && !/^\d{1,3}$/.test(formData.vitalSigns.respiratoryRate)) {
      errors.push('Respiratory Rate must be a number (e.g., 16).');
    }
    if (formData.vitalSigns.oxygenSaturation && !/^\d{1,3}%?$/.test(formData.vitalSigns.oxygenSaturation)) {
      errors.push('Oxygen Saturation must be a percentage (e.g., 98%).');
    }
    if (formData.vitalSigns.weight && !/^\d{1,3}(\.\d)?$/.test(formData.vitalSigns.weight)) {
      errors.push('Weight must be a number (e.g., 180).');
    }
    if (formData.vitalSigns.height && !/^\d'\d{1,2}"?$/.test(formData.vitalSigns.height)) {
      errors.push('Height must be in the format X\'YY" (e.g., 5\'10").');
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    // Format form data for submission
    const submissionData = {
      ...formData,
      date: formatDate(formData.date),
      followUpDate: formatDate(formData.followUpDate),
    };

    // Save consultation data and complete appointment
    try {
      // Save consultation to database
      const consultationData = {
        patient_id: parseInt(patientId),
        staff_id: parseInt(localStorage.getItem('staff_id') || '1007'),
        appointment_id: appointmentId ? parseInt(appointmentId) : null,
        consultation_date: submissionData.date,
        chief_complaint: formData.chiefComplaint,
        history: formData.history,
        examination: formData.examination,
        vital_signs: formData.vitalSigns,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        medications: formData.medications,
        lab_tests: formData.labTests,
        follow_up_date: submissionData.followUpDate,
        follow_up_notes: formData.followUpNotes,
        notes: `Consultation completed. ${formData.chiefComplaint}`
      };
      
      await apiFetch('/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationData)
      });
      
      // Skip appointment status update since 'Completed' is not allowed by CHECK constraint
      // The appointment will remain as 'Approved' after consultation
      console.log('Consultation completed, appointment remains as Approved');
      
      console.log('Consultation data saved:', consultationData);
      toast.success('Consultation completed successfully!');
      
      setTimeout(() => {
        navigate('/DoctorsDashboard');
      }, 1000);
    } catch (error) {
      console.error('Error saving consultation:', error);
      toast.error('Failed to save consultation');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    toast.info('Consultation cancelled');
    navigate('/DoctorsDashboard');
  };

  // If loading, show loading message
  if (loading) {
    return (
      <div className="consultation-form loading">
        <p className="text-center text-gray-500">Loading patient information...</p>
      </div>
    );
  }

  // If patient not found, show error message
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

  // If appointment not found, show warning
  if (appointmentId && !appointment) {
    return (
      <div className="centered-container">
        <div className="centered-content">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="text-red-600">Appointment Not Found</h1>
              <p>The appointment with ID {appointmentId} could not be found.</p>
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
            <FaNotesMedical /> New Consultation
          </h1>
          <p className="page-subtitle">Record patient consultation details</p>
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
                  {patient.bloodType && <span>Blood Type: {patient.bloodType}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Consultation Details</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Consultation Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chief Complaint</label>
                <input
                  type="text"
                  className="form-input"
                  name="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={handleInputChange}
                  placeholder="Patient's main complaint"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Medical History</label>
                <textarea
                  className="form-input"
                  name="history"
                  value={formData.history}
                  onChange={handleInputChange}
                  placeholder="Patient's medical history relevant to this visit"
                  rows={3}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Physical Examination</label>
                <textarea
                  className="form-input"
                  name="examination"
                  value={formData.examination}
                  onChange={handleInputChange}
                  placeholder="Physical examination findings"
                  rows={3}
                  required
                />
              </div>

              <div className="vital-signs-section full-width">
                <h3 className="section-title">
                  <FaHeartbeat /> Vital Signs
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <FaHeartbeat className="mr-2" /> Blood Pressure
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="bloodPressure"
                      value={formData.vitalSigns.bloodPressure}
                      onChange={handleVitalSignsChange}
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaHeartbeat className="mr-2" /> Heart Rate
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="heartRate"
                      value={formData.vitalSigns.heartRate}
                      onChange={handleVitalSignsChange}
                      placeholder="e.g., 72 bpm"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaTemperatureHigh className="mr-2" /> Temperature
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="temperature"
                      value={formData.vitalSigns.temperature}
                      onChange={handleVitalSignsChange}
                      placeholder="e.g., 98.6°F"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <FaWeight className="mr-2" /> Weight
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="weight"
                      value={formData.vitalSigns.weight}
                      onChange={handleVitalSignsChange}
                      placeholder="e.g., 180 lbs"
                    />
                  </div>
                </div>
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
                <label className="form-label">Treatment Plan</label>
                <textarea
                  className="form-input"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  placeholder="Recommended treatment plan"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Medications</label>
                <textarea
                  className="form-input"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="Prescribed medications"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lab Tests</label>
                <select
                  className="form-input"
                  name="labTests"
                  value={formData.labTests}
                  onChange={handleInputChange}
                >
                  <option value="">Select Lab Test</option>
                  {labTestOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Follow-up Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.followUpDate ? formData.followUpDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value ? new Date(e.target.value) : null })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Follow-up Notes</label>
                <textarea
                  className="form-input"
                  name="followUpNotes"
                  value={formData.followUpNotes}
                  onChange={handleInputChange}
                  placeholder="Notes for follow-up appointment"
                  rows={2}
                />
              </div>

              <div className="form-actions full-width">
                <button type="submit" className="btn btn-success" style={{marginRight: '0.5rem'}}>
                  Save Consultation
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

export default ConsultationForm;
