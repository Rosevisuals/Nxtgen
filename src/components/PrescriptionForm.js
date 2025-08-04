import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserInjured, FaPrescriptionBottleAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import DatePicker from './ui/DatePicker';
import Badge from './ui/Badge';
import { apiFetch } from '../utils/api';

// Mock patient data (move to a separate file for production)
const mockPatients = {
  'P-10025': {
    id: 'P-10025',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    dob: '1980-05-15',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
  },
  'P-10032': {
    id: 'P-10032',
    name: 'Jane Smith',
    age: 38,
    gender: 'Female',
    dob: '1987-08-22',
    allergies: ['Sulfa drugs'],
    chronicConditions: [],
  },
};

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
        staff_id: parseInt(localStorage.getItem('user_id') || '1'),
        Medication: formData.medications.map(med => med.name).join(', '),
        dosage: formData.medications.map(med => med.dosage).join(', '),
        notes: formData.notes,
        date_issued: submissionData.date
      };
      
      await apiFetch('/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });
      
      toast.success('Prescription saved successfully!');
      setTimeout(() => {
        navigate(`/doctor/patients/${patientId}`);
      }, 1000);
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    toast.info('Prescription cancelled');
    if (patientId) {
      navigate(`/doctor/patients/${patientId}`);
    } else {
      navigate('/doctor/dashboard');
    }
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
      <div className="prescription-form not-found">
        <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
        <p className="text-gray-700">The patient with ID {patientId} could not be found.</p>
        <Button variant="primary" onClick={() => navigate('/doctor/patients')}>
          Back to Patient Lookup
        </Button>
      </div>
    );
  }

  return (
    <div className="prescription-form container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">New Prescription</h1>
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

      {/* Prescription Form */}
      <Card title="Prescription Details" className="prescription-details-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-row">
            <DatePicker
              label="Prescription Date"
              name="date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              required
              aria-label="Prescription Date"
              aria-required="true"
            />
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
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about the prescription"
              multiline
              rows={2}
              aria-label="Notes"
            />
          </div>

          <h4 className="text-lg font-semibold text-gray-700 flex items-center">
            <FaPrescriptionBottleAlt className="section-icon mr-2 text-blue-500" />
            Medications
          </h4>

          {formData.medications.map((medication, index) => (
            <div key={index} className="medication-item border-b pb-4 mb-4">
              <div className="medication-header flex justify-between items-center">
                <h5 className="text-md font-semibold">Medication {index + 1}</h5>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => handleRemoveMedication(index)}
                  disabled={formData.medications.length === 1}
                  aria-label={`Remove medication ${index + 1}`}
                >
                  <FaTrash className="text-red-500" />
                </Button>
              </div>

              <div className="medication-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Medication Name"
                  value={medication.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  options={medicationOptions}
                  required
                  aria-label={`Medication ${index + 1} Name`}
                  aria-required="true"
                />

                <Input
                  label="Dosage"
                  value={medication.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  placeholder="e.g., 10mg"
                  required
                  aria-label={`Medication ${index + 1} Dosage`}
                  aria-required="true"
                />

                <Select
                  label="Frequency"
                  value={medication.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  options={frequencyOptions}
                  required
                  aria-label={`Medication ${index + 1} Frequency`}
                  aria-required="true"
                />

                <Select
                  label="Duration"
                  value={medication.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  options={durationOptions}
                  required
                  aria-label={`Medication ${index + 1} Duration`}
                  aria-required="true"
                />

                <Input
                  label="Special Instructions"
                  value={medication.instructions}
                  onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  placeholder="e.g., Take with food"
                  className="col-span-1 md:col-span-2"
                  aria-label={`Medication ${index + 1} Instructions`}
                />
              </div>
            </div>
          ))}

          <div className="add-medication">
            <Button
              variant="outline"
              onClick={handleAddMedication}
              type="button"
              className="flex items-center"
            >
              <FaPlus className="mr-2" /> Add Another Medication
            </Button>
          </div>

          <div className="form-actions flex space-x-4 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Prescription
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PrescriptionForm;