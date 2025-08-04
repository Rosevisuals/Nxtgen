import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserInjured, FaHeartbeat, FaWeight, FaRulerVertical, FaTemperatureHigh, FaLungs, FaTint } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import DatePicker from './ui/DatePicker';
import Badge from './ui/Badge';
import { apiFetch } from '../utils/api';

// Mock data
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

  // Handle follow-up date change
  const handleFollowUpDateChange = (date) => {
    setFormData({
      ...formData,
      followUpDate: date,
    });
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
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

    // In a real app, this would send the data to an API
    console.log('Consultation data:', submissionData);

    // Show success message and navigate back
    toast.success('Consultation saved successfully!');
    setTimeout(() => {
      navigate(`/doctor/patients/${patientId}`);
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    toast.info('Consultation cancelled');
    if (patientId) {
      navigate(`/doctor/patients/${patientId}`);
    } else {
      navigate('/doctor/dashboard');
    }
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
      <div className="consultation-form not-found">
        <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
        <p className="text-gray-700">The patient with ID {patientId} could not be found.</p>
        <Button variant="primary" onClick={() => navigate('/doctor/patients')}>
          Back to Patient Lookup
        </Button>
      </div>
    );
  }

  // If appointment not found, show warning
  if (appointmentId && !appointment) {
    return (
      <div className="consultation-form not-found">
        <h1 className="text-2xl font-bold text-red-600">Appointment Not Found</h1>
        <p className="text-gray-700">The appointment with ID {appointmentId} could not be found.</p>
        <Button variant="primary" onClick={() => navigate('/doctor/patients')}>
          Back to Patient Lookup
        </Button>
      </div>
    );
  }

  return (
    <div className="consultation-form container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">New Consultation</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Patient Information */}
      {patient && (
        <Card className="patient-info-card mb-6">
          <div className="patient-header flex flex-col md:flex-row justify-between">
            <div className="patient-details">
              <h3 className="text-xl font-semibold flex items-center">
                <FaUserInjured className="patient-icon mr-2 text-blue-500" />
                {patient.name}
              </h3>
              <div className="patient-meta flex space-x-4 text-gray-600">
                <span>{patient.age} years</span>
                <span>{patient.gender}</span>
                <span>ID: {patient.id}</span>
              </div>
            </div>

            <div className="patient-conditions mt-4 md:mt-0">
              {patient.allergies.length > 0 && (
                <div className="allergies">
                  <strong className="text-gray-700">Allergies:</strong>
                  <div className="badges flex flex-wrap gap-2 mt-1">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="danger" pill>
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.chronicConditions.length > 0 && (
                <div className="chronic-conditions mt-2">
                  <strong className="text-gray-700">Chronic Conditions:</strong>
                  <div className="badges flex flex-wrap gap-2 mt-1">
                    {patient.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="primary" pill>
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Consultation Form */}
      <Card title="Consultation Details" className="consultation-details-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-row">
            <DatePicker
              label="Consultation Date"
              name="date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              required
              aria-label="Consultation Date"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <Input
              label="Chief Complaint"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              placeholder="Patient's main complaint"
              required
              aria-label="Chief Complaint"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <Input
              label="History"
              name="history"
              value={formData.history}
              onChange={handleInputChange}
              placeholder="Patient's medical history relevant to this visit"
              multiline
              rows={3}
              aria-label="Medical History"
            />
          </div>

          <div className="form-row">
            <Input
              label="Examination"
              name="examination"
              value={formData.examination}
              onChange={handleInputChange}
              placeholder="Physical examination findings"
              multiline
              rows={3}
              required
              aria-label="Physical Examination"
              aria-required="true"
            />
          </div>

          <h4 className="text-lg font-semibold text-gray-700">Vital Signs</h4>
          <div className="vital-signs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="vital-sign flex items-center space-x-2">
              <FaHeartbeat className="vital-icon text-blue-500" />
              <Input
                label="Blood Pressure"
                name="bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 120/80"
                aria-label="Blood Pressure"
              />
            </div>

            <div className="vital-sign flex items-center space-x-2">
              <FaHeartbeat className="vital-icon text-blue-500" />
              <Input
                label="Heart Rate"
                name="heartRate"
                value={formData.vitalSigns.heartRate}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 72 bpm"
                aria-label="Heart Rate"
              />
            </div>

            <div className="vital-sign flex items-center space-x-2">
              <FaTemperatureHigh className="vital-icon text-blue-500" />
              <Input
                label="Temperature"
                name="temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 98.6°F"
                aria-label="Temperature"
              />
            </div>

            <div className="vital-sign flex items-center space-x-2">
              <FaLungs className="vital-icon text-blue-500" />
              <Input
                label="Respiratory Rate"
                name="respiratoryRate"
                value={formData.vitalSigns.respiratoryRate}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 16 breaths/min"
                aria-label="Respiratory Rate"
              />
            </div>

            <div className="vital-sign flex items-center space-x-2">
              <FaTint className="vital-icon text-blue-500" />
              <Input
                label="Oxygen Saturation"
                name="oxygenSaturation"
                value={formData.vitalSigns.oxygenSaturation}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 98%"
                aria-label="Oxygen Saturation"
              />
            </div>

            <div className="vital-sign flex items-center space-x-2">
              <FaWeight className="vital-icon text-blue-500" />
              <Input
                label="Weight"
                name="weight"
                value={formData.vitalSigns.weight}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 180 lbs"
                aria-label="Weight"
              />
            </div>

            <div className="vital-sign flex items-center space-x-2">
              <FaRulerVertical className="vital-icon text-blue-500" />
              <Input
                label="Height"
                name="height"
                value={formData.vitalSigns.height}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 5'10&quot;"
                aria-label="Height"
              />
            </div>
          </div>

          <div className="form-row">
            <Select
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              options={diagnosisOptions}
              required
              aria-label="Diagnosis"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <Input
              label="Treatment Plan"
              name="treatment"
              value={formData.treatment}
              onChange={handleInputChange}
              placeholder="Recommended treatment plan"
              multiline
              rows={3}
              required
              aria-label="Treatment Plan"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <Input
              label="Medications"
              name="medications"
              value={formData.medications}
              onChange={handleInputChange}
              placeholder="Prescribed medications"
              multiline
              rows={3}
              aria-label="Medications"
            />
          </div>

          <div className="form-row">
            <Select
              label="Lab Tests"
              name="labTests"
              value={formData.labTests}
              onChange={handleInputChange}
              options={labTestOptions}
              isMulti
              aria-label="Lab Tests"
            />
          </div>

          <div className="form-row">
            <DatePicker
              label="Follow-up Date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleFollowUpDateChange}
              minDate={new Date()}
              aria-label="Follow-up Date"
            />
          </div>

          <div className="form-row">
            <Input
              label="Follow-up Notes"
              name="followUpNotes"
              value={formData.followUpNotes}
              onChange={handleInputChange}
              placeholder="Notes for follow-up appointment"
              multiline
              rows={2}
              aria-label="Follow-up Notes"
            />
          </div>

          <div className="form-actions flex space-x-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Consultation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ConsultationForm;
