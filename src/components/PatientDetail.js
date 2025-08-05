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
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Table from './ui/Table';
import Tabs from './ui/Tabs';
import { apiFetch } from '../utils/api';
import { toast } from 'react-toastify';

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
  
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const patientsData = await apiFetch('/patients');
        const patientData = patientsData?.find(p => p.patient_id.toString() === patientId);
        
        if (patientData) {
          const formattedPatient = {
            id: patientData.patient_id,
            name: patientData.full_Name,
            age: patientData.DOB ? new Date().getFullYear() - new Date(patientData.DOB).getFullYear() : 0,
            gender: patientData.gender === 'M' ? 'Male' : patientData.gender === 'F' ? 'Female' : 'Other',
            dob: patientData.DOB ? new Date(patientData.DOB).toISOString().split('T')[0] : '',
            phone: patientData.phone || '',
            email: patientData.email || '',
            address: patientData.Address || '',
            bloodType: patientData.blood_group || '',
            height: '',
            weight: '',
            bmi: parseFloat(patientData.BMI) || 0,
            allergies: [],
            chronicConditions: [],
            emergencyContact: {
              name: '',
              relation: '',
              phone: '',
            },
            vitalSigns: [],
            consultations: [],
            prescriptions: [],
            labResults: [],
          };
          setPatient(formattedPatient);
        } else {
          setPatient(null);
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