import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserInjured, FaPrescriptionBottleAlt, FaPlus, FaTrash } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from '../../components/ui/DatePicker';
import Badge from '../../components/ui/Badge';

/**
 * PrescriptionForm Component
 * 
 * Form for doctors to create new prescriptions.
 */
const PrescriptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  
  // Form state
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
  
  // Mock patient data (in a real app, this would come from an API)
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
  
  // Fetch patient data
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      if (patientId) {
        const patientData = mockPatients[patientId];
        setPatient(patientData);
      }
      setLoading(false);
    }, 500);
  }, [patientId]);
  
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
      return; // Don't remove the last medication
    }
    
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    console.log('Prescription data:', formData);
    
    // Show success message and navigate back
    alert('Prescription saved successfully!');
    navigate(`/doctor/patients/${patientId}`);
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (patientId) {
      navigate(`/doctor/patients/${patientId}`);
    } else {
      navigate('/doctor/dashboard');
    }
  };
  
  // If loading, show loading message
  if (loading) {
    return (
      <div className="prescription-form loading">
        <p>Loading patient information...</p>
      </div>
    );
  }
  
  // If patient not found, show error message
  if (patientId && !patient) {
    return (
      <div className="prescription-form not-found">
        <h1>Patient Not Found</h1>
        <p>The patient with ID {patientId} could not be found.</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/doctor/patients')}
        >
          Back to Patient Lookup
        </Button>
      </div>
    );
  }
  
  return (
    <div className="prescription-form">
      <h1>New Prescription</h1>
      
      {/* Patient Information */}
      {patient && (
        <Card className="patient-info-card">
          <div className="patient-header">
            <div className="patient-details">
              <h3>
                <FaUserInjured className="patient-icon" />
                {patient.name}
              </h3>
              <div className="patient-meta">
                <span>{patient.age} years</span>
                <span>{patient.gender}</span>
                <span>ID: {patient.id}</span>
              </div>
            </div>
            
            <div className="patient-conditions">
              {patient.allergies.length > 0 && (
                <div className="allergies">
                  <strong>Allergies:</strong>
                  <div className="badges">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="danger" pill>
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {patient.chronicConditions.length > 0 && (
                <div className="chronic-conditions">
                  <strong>Chronic Conditions:</strong>
                  <div className="badges">
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
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <DatePicker
              label="Prescription Date"
              name="date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              required
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
            />
          </div>
          
          <h4>
            <FaPrescriptionBottleAlt className="section-icon" />
            Medications
          </h4>
          
          {formData.medications.map((medication, index) => (
            <div key={index} className="medication-item">
              <div className="medication-header">
                <h5>Medication {index + 1}</h5>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => handleRemoveMedication(index)}
                  disabled={formData.medications.length === 1}
                  aria-label="Remove medication"
                >
                  <FaTrash />
                </Button>
              </div>
              
              <div className="medication-grid">
                <Select
                  label="Medication Name"
                  value={medication.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  options={medicationOptions}
                  required
                />
                
                <Input
                  label="Dosage"
                  value={medication.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  placeholder="e.g., 10mg"
                  required
                />
                
                <Select
                  label="Frequency"
                  value={medication.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  options={frequencyOptions}
                  required
                />
                
                <Select
                  label="Duration"
                  value={medication.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  options={durationOptions}
                  required
                />
                
                <Input
                  label="Special Instructions"
                  value={medication.instructions}
                  onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  placeholder="e.g., Take with food"
                  className="full-width"
                />
              </div>
            </div>
          ))}
          
          <div className="add-medication">
            <Button
              variant="outline"
              onClick={handleAddMedication}
              type="button"
            >
              <FaPlus /> Add Another Medication
            </Button>
          </div>
          
          <div className="form-actions">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              Save Prescription
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PrescriptionForm;