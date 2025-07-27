import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUserInjured, 
  FaCalendarAlt, 
  FaFileMedical, 
  FaPrescriptionBottleAlt, 
  FaVial, 
  FaHeartbeat, 
  FaWeight, 
  FaRulerVertical, 
  FaPhone, 
  FaEnvelope, 
  FaIdCard, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Tabs from '../../components/ui/Tabs';

/**
 * PatientDetail Component
 * 
 * Displays detailed information about a patient.
 */
const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock patient data (in a real app, this would come from an API)
  const mockPatients = {
    'P-10025': {
      id: 'P-10025',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      dob: '1980-05-15',
      phone: '(123) 456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St, Anytown, USA',
      bloodType: 'O+',
      height: '5\'10"',
      weight: '180 lbs',
      bmi: 25.8,
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      emergencyContact: {
        name: 'Jane Doe',
        relation: 'Wife',
        phone: '(123) 456-7899',
      },
      vitalSigns: [
        {
          date: '2025-07-20',
          bloodPressure: '130/85',
          heartRate: 75,
          temperature: '98.6°F',
          respiratoryRate: 16,
          oxygenSaturation: '98%',
        },
        {
          date: '2025-06-15',
          bloodPressure: '135/88',
          heartRate: 78,
          temperature: '98.4°F',
          respiratoryRate: 18,
          oxygenSaturation: '97%',
        },
        {
          date: '2025-05-10',
          bloodPressure: '140/90',
          heartRate: 80,
          temperature: '98.7°F',
          respiratoryRate: 17,
          oxygenSaturation: '96%',
        },
      ],
      consultations: [
        {
          id: 'C-5001',
          date: '2025-07-20',
          doctor: 'Dr. John Smith',
          diagnosis: 'Hypertension',
          notes: 'Blood pressure remains elevated. Adjusting medication dosage.',
          followUp: '2025-08-20',
        },
        {
          id: 'C-4850',
          date: '2025-06-15',
          doctor: 'Dr. John Smith',
          diagnosis: 'Type 2 Diabetes',
          notes: 'Blood sugar levels improved. Continue with current medication.',
          followUp: '2025-07-20',
        },
        {
          id: 'C-4720',
          date: '2025-05-10',
          doctor: 'Dr. Emily Johnson',
          diagnosis: 'Annual Check-up',
          notes: 'General health is good. Recommended lifestyle changes to manage hypertension.',
          followUp: '2025-06-15',
        },
      ],
      prescriptions: [
        {
          id: 'RX-7001',
          date: '2025-07-20',
          medication: 'Lisinopril',
          dosage: '20mg',
          frequency: 'Once daily',
          duration: '30 days',
          doctor: 'Dr. John Smith',
          notes: 'Take in the morning with food.',
        },
        {
          id: 'RX-6850',
          date: '2025-07-20',
          medication: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          doctor: 'Dr. John Smith',
          notes: 'Take with meals.',
        },
        {
          id: 'RX-6720',
          date: '2025-06-15',
          medication: 'Atorvastatin',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          doctor: 'Dr. John Smith',
          notes: 'Take at bedtime.',
        },
      ],
      labResults: [
        {
          id: 'LAB-3001',
          date: '2025-07-20',
          test: 'Complete Blood Count',
          result: 'Normal',
          notes: 'All values within normal range.',
          doctor: 'Dr. John Smith',
        },
        {
          id: 'LAB-2950',
          date: '2025-07-20',
          test: 'Lipid Panel',
          result: 'Abnormal',
          notes: 'LDL cholesterol elevated at 150 mg/dL. HDL within normal range.',
          doctor: 'Dr. John Smith',
        },
        {
          id: 'LAB-2920',
          date: '2025-06-15',
          test: 'HbA1c',
          result: 'Abnormal',
          notes: 'HbA1c at 7.2%. Indicates good diabetes control but still above target.',
          doctor: 'Dr. John Smith',
        },
      ],
    },
    'P-10032': {
      id: 'P-10032',
      name: 'Jane Smith',
      age: 38,
      gender: 'Female',
      dob: '1987-08-22',
      phone: '(123) 456-7891',
      email: 'jane.smith@example.com',
      address: '456 Oak Ave, Anytown, USA',
      bloodType: 'A+',
      height: '5\'6"',
      weight: '140 lbs',
      bmi: 22.6,
      allergies: ['Sulfa drugs'],
      chronicConditions: [],
      emergencyContact: {
        name: 'Robert Smith',
        relation: 'Husband',
        phone: '(123) 456-7892',
      },
      vitalSigns: [
        {
          date: '2025-07-22',
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: '98.6°F',
          respiratoryRate: 16,
          oxygenSaturation: '99%',
        },
      ],
      consultations: [
        {
          id: 'C-5002',
          date: '2025-07-22',
          doctor: 'Dr. John Smith',
          diagnosis: 'Chest Pain',
          notes: 'Patient reports intermittent chest pain. ECG normal. Scheduled stress test.',
          followUp: '2025-07-29',
        },
      ],
      prescriptions: [],
      labResults: [
        {
          id: 'LAB-3002',
          date: '2025-07-22',
          test: 'Complete Blood Count',
          result: 'Normal',
          notes: 'All values within normal range.',
          doctor: 'Dr. John Smith',
        },
        {
          id: 'LAB-3003',
          date: '2025-07-22',
          test: 'Cardiac Enzymes',
          result: 'Normal',
          notes: 'No evidence of myocardial damage.',
          doctor: 'Dr. John Smith',
        },
      ],
    },
  };
  
  // Fetch patient data
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      const patientData = mockPatients[patientId];
      setPatient(patientData);
      setLoading(false);
    }, 500);
  }, [patientId]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle new consultation
  const handleNewConsultation = () => {
    navigate(`/doctor/consultations/new?patientId=${patientId}`);
  };
  
  // Handle new prescription
  const handleNewPrescription = () => {
    navigate(`/doctor/prescriptions/new?patientId=${patientId}`);
  };
  
  // Handle new lab request
  const handleNewLabRequest = () => {
    navigate(`/doctor/lab-requests/new?patientId=${patientId}`);
  };
  
  // Table columns for consultations
  const consultationColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Doctor', accessor: 'doctor' },
    { 
      header: 'Diagnosis', 
      accessor: 'diagnosis',
      cell: (row) => (
        <Badge variant="primary" pill>
          {row.diagnosis}
        </Badge>
      ),
    },
    { header: 'Notes', accessor: 'notes' },
    { header: 'Follow-up', accessor: 'followUp' },
    {
      header: 'Actions',
      cell: (row) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/doctor/consultations/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];
  
  // Table columns for prescriptions
  const prescriptionColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Medication', accessor: 'medication' },
    { header: 'Dosage', accessor: 'dosage' },
    { header: 'Frequency', accessor: 'frequency' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Notes', accessor: 'notes' },
    {
      header: 'Actions',
      cell: (row) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/doctor/prescriptions/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];
  
  // Table columns for lab results
  const labResultColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Test', accessor: 'test' },
    { 
      header: 'Result', 
      accessor: 'result',
      cell: (row) => (
        <Badge 
          variant={row.result === 'Normal' ? 'success' : 'warning'} 
          pill
        >
          {row.result}
        </Badge>
      ),
    },
    { header: 'Notes', accessor: 'notes' },
    {
      header: 'Actions',
      cell: (row) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/doctor/lab-results/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];
  
  // Table columns for vital signs
  const vitalSignsColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Blood Pressure', accessor: 'bloodPressure' },
    { header: 'Heart Rate', accessor: 'heartRate' },
    { header: 'Temperature', accessor: 'temperature' },
    { header: 'Respiratory Rate', accessor: 'respiratoryRate' },
    { header: 'Oxygen Saturation', accessor: 'oxygenSaturation' },
  ];
  
  // If loading, show loading message
  if (loading) {
    return (
      <div className="patient-detail loading">
        <p>Loading patient information...</p>
      </div>
    );
  }
  
  // If patient not found, show error message
  if (!patient) {
    return (
      <div className="patient-detail not-found">
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
    <div className="patient-detail">
      {/* Patient Header */}
      <div className="patient-header">
        <div className="patient-info">
          <h1>
            <FaUserInjured className="patient-icon" />
            {patient.name}
          </h1>
          <div className="patient-meta">
            <span className="patient-id">
              <FaIdCard /> ID: {patient.id}
            </span>
            <span className="patient-age">
              Age: {patient.age}
            </span>
            <span className="patient-gender">
              Gender: {patient.gender}
            </span>
          </div>
        </div>
        
        <div className="patient-actions">
          <Button 
            variant="primary" 
            onClick={handleNewConsultation}
          >
            <FaFileMedical /> New Consultation
          </Button>
          <Button 
            variant="outline" 
            onClick={handleNewPrescription}
          >
            <FaPrescriptionBottleAlt /> New Prescription
          </Button>
          <Button 
            variant="outline" 
            onClick={handleNewLabRequest}
          >
            <FaVial /> New Lab Request
          </Button>
        </div>
      </div>
      
      {/* Patient Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={handleTabChange}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'consultations', label: 'Consultations' },
          { id: 'prescriptions', label: 'Prescriptions' },
          { id: 'lab-results', label: 'Lab Results' },
          { id: 'vital-signs', label: 'Vital Signs' },
        ]}
      />
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <Card title="Personal Information" className="personal-info-card">
                <div className="info-grid">
                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Date of Birth</span>
                      <span className="info-value">{patient.dob}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaPhone className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{patient.phone}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaEnvelope className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{patient.email}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Address</span>
                      <span className="info-value">{patient.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="emergency-contact">
                  <h4>Emergency Contact</h4>
                  <p>
                    <strong>{patient.emergencyContact.name}</strong> ({patient.emergencyContact.relation})
                    <br />
                    {patient.emergencyContact.phone}
                  </p>
                </div>
              </Card>
              
              <Card title="Medical Information" className="medical-info-card">
                <div className="info-grid">
                  <div className="info-item">
                    <FaHeartbeat className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Blood Type</span>
                      <span className="info-value">{patient.bloodType}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaRulerVertical className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Height</span>
                      <span className="info-value">{patient.height}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaWeight className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Weight</span>
                      <span className="info-value">{patient.weight}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-content">
                      <span className="info-label">BMI</span>
                      <span className="info-value">{patient.bmi}</span>
                    </div>
                  </div>
                </div>
                
                <div className="medical-conditions">
                  <h4>Allergies</h4>
                  <div className="badges">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="danger" pill>
                        {allergy}
                      </Badge>
                    ))}
                    {patient.allergies.length === 0 && (
                      <span className="no-data">No known allergies</span>
                    )}
                  </div>
                  
                  <h4>Chronic Conditions</h4>
                  <div className="badges">
                    {patient.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="primary" pill>
                        {condition}
                      </Badge>
                    ))}
                    {patient.chronicConditions.length === 0 && (
                      <span className="no-data">No chronic conditions</span>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            <Card title="Recent Consultations" className="recent-consultations-card">
              <Table
                columns={consultationColumns}
                data={patient.consultations.slice(0, 3)}
                striped
                hoverable
              />
              {patient.consultations.length > 3 && (
                <div className="view-all">
                  <Button 
                    variant="text" 
                    onClick={() => handleTabChange('consultations')}
                  >
                    View All Consultations
                  </Button>
                </div>
              )}
            </Card>
            
            <Card title="Current Medications" className="current-medications-card">
              <Table
                columns={prescriptionColumns}
                data={patient.prescriptions.slice(0, 3)}
                striped
                hoverable
              />
              {patient.prescriptions.length > 3 && (
                <div className="view-all">
                  <Button 
                    variant="text" 
                    onClick={() => handleTabChange('prescriptions')}
                  >
                    View All Prescriptions
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
        
        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <Card title="Consultations History" className="consultations-card">
            <div className="card-actions">
              <Button 
                variant="primary" 
                onClick={handleNewConsultation}
              >
                <FaFileMedical /> New Consultation
              </Button>
            </div>
            
            <Table
              columns={consultationColumns}
              data={patient.consultations}
              striped
              hoverable
            />
          </Card>
        )}
        
        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <Card title="Prescriptions History" className="prescriptions-card">
            <div className="card-actions">
              <Button 
                variant="primary" 
                onClick={handleNewPrescription}
              >
                <FaPrescriptionBottleAlt /> New Prescription
              </Button>
            </div>
            
            <Table
              columns={prescriptionColumns}
              data={patient.prescriptions}
              striped
              hoverable
            />
          </Card>
        )}
        
        {/* Lab Results Tab */}
        {activeTab === 'lab-results' && (
          <Card title="Lab Results History" className="lab-results-card">
            <div className="card-actions">
              <Button 
                variant="primary" 
                onClick={handleNewLabRequest}
              >
                <FaVial /> New Lab Request
              </Button>
            </div>
            
            <Table
              columns={labResultColumns}
              data={patient.labResults}
              striped
              hoverable
            />
          </Card>
        )}
        
        {/* Vital Signs Tab */}
        {activeTab === 'vital-signs' && (
          <Card title="Vital Signs History" className="vital-signs-card">
            <Table
              columns={vitalSignsColumns}
              data={patient.vitalSigns}
              striped
              hoverable
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;