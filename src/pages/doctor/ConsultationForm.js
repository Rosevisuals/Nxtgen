import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserInjured, FaHeartbeat, FaWeight, FaRulerVertical, FaTemperatureHigh, FaLungs, FaTint } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from '../../components/ui/DatePicker';
import Badge from '../../components/ui/Badge';

/**
 * ConsultationForm Component
 * 
 * Form for doctors to record consultation notes.
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
  
  // Mock patient data (in a real app, this would come from an API)
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
        heartRate: 75,
        temperature: '98.6°F',
        respiratoryRate: 16,
        oxygenSaturation: '98%',
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
        heartRate: 72,
        temperature: '98.6°F',
        respiratoryRate: 16,
        oxygenSaturation: '99%',
      },
    },
  };
  
  // Mock appointments data
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
  
  // Lab test options
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
  
  // Fetch patient and appointment data
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      if (patientId) {
        const patientData = mockPatients[patientId];
        setPatient(patientData);
        
        // Pre-fill vital signs from patient's last record
        if (patientData) {
          setFormData(prevData => ({
            ...prevData,
            vitalSigns: {
              ...prevData.vitalSigns,
              bloodPressure: patientData.lastVitalSigns.bloodPressure,
              heartRate: patientData.lastVitalSigns.heartRate,
              temperature: patientData.lastVitalSigns.temperature,
              respiratoryRate: patientData.lastVitalSigns.respiratoryRate,
              oxygenSaturation: patientData.lastVitalSigns.oxygenSaturation,
              weight: patientData.weight.replace(' lbs', ''),
              height: patientData.height,
            },
          }));
        }
      }
      
      if (appointmentId) {
        const appointmentData = mockAppointments[appointmentId];
        setAppointment(appointmentData);
        
        // Pre-fill chief complaint from appointment notes
        if (appointmentData) {
          setFormData(prevData => ({
            ...prevData,
            chiefComplaint: appointmentData.notes,
          }));
        }
      }
      
      setLoading(false);
    }, 500);
  }, [patientId, appointmentId]);
  
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
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    console.log('Consultation data:', formData);
    
    // Show success message and navigate back
    alert('Consultation saved successfully!');
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
      <div className="consultation-form loading">
        <p>Loading patient information...</p>
      </div>
    );
  }
  
  // If patient not found, show error message
  if (patientId && !patient) {
    return (
      <div className="consultation-form not-found">
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
    <div className="consultation-form">
      <h1>New Consultation</h1>
      
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
      
      {/* Consultation Form */}
      <Card title="Consultation Details" className="consultation-details-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <DatePicker
              label="Consultation Date"
              name="date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              required
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
            />
          </div>
          
          <h4>Vital Signs</h4>
          <div className="vital-signs-grid">
            <div className="vital-sign">
              <FaHeartbeat className="vital-icon" />
              <Input
                label="Blood Pressure"
                name="bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 120/80"
              />
            </div>
            
            <div className="vital-sign">
              <FaHeartbeat className="vital-icon" />
              <Input
                label="Heart Rate"
                name="heartRate"
                value={formData.vitalSigns.heartRate}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 72 bpm"
              />
            </div>
            
            <div className="vital-sign">
              <FaTemperatureHigh className="vital-icon" />
              <Input
                label="Temperature"
                name="temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 98.6°F"
              />
            </div>
            
            <div className="vital-sign">
              <FaLungs className="vital-icon" />
              <Input
                label="Respiratory Rate"
                name="respiratoryRate"
                value={formData.vitalSigns.respiratoryRate}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 16 breaths/min"
              />
            </div>
            
            <div className="vital-sign">
              <FaTint className="vital-icon" />
              <Input
                label="Oxygen Saturation"
                name="oxygenSaturation"
                value={formData.vitalSigns.oxygenSaturation}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 98%"
              />
            </div>
            
            <div className="vital-sign">
              <FaWeight className="vital-icon" />
              <Input
                label="Weight"
                name="weight"
                value={formData.vitalSigns.weight}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 180 lbs"
              />
            </div>
            
            <div className="vital-sign">
              <FaRulerVertical className="vital-icon" />
              <Input
                label="Height"
                name="height"
                value={formData.vitalSigns.height}
                onChange={handleVitalSignsChange}
                placeholder="e.g., 5'10&quot;"
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
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Follow-up Date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleFollowUpDateChange}
              minDate={new Date()}
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
            />
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
              Save Consultation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ConsultationForm;