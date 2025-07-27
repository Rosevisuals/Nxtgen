import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaWeight, FaRulerVertical, FaHeartbeat, FaCalendarAlt, FaFileMedical, FaUserMd } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

/**
 * Patient Dashboard Component
 * 
 * Displays patient's personal information, health metrics, and upcoming appointments.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock patient data (in a real app, this would come from an API)
  const mockPatient = {
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
    vitalSigns: {
      bloodPressure: '130/85',
      heartRate: 75,
      temperature: '98.6°F',
      respiratoryRate: 16,
      oxygenSaturation: '98%',
      lastUpdated: '2025-07-20',
    },
    upcomingAppointments: [
      {
        id: 1,
        date: new Date('2025-07-30'),
        time: '10:00 AM',
        doctor: 'Dr. John Smith',
        department: 'Cardiology',
        type: 'Check-up',
        status: 'Scheduled',
      },
      {
        id: 2,
        date: new Date('2025-08-15'),
        time: '02:30 PM',
        doctor: 'Dr. Emily Johnson',
        department: 'Neurology',
        type: 'Consultation',
        status: 'Scheduled',
      },
    ],
    recentAppointments: [
      {
        id: 3,
        date: new Date('2025-07-20'),
        time: '09:00 AM',
        doctor: 'Dr. John Smith',
        department: 'Cardiology',
        type: 'Check-up',
        status: 'Completed',
        diagnosis: 'Hypertension',
        notes: 'Blood pressure remains elevated. Adjusting medication dosage.',
      },
      {
        id: 4,
        date: new Date('2025-06-15'),
        time: '11:30 AM',
        doctor: 'Dr. John Smith',
        department: 'Cardiology',
        type: 'Follow-up',
        status: 'Completed',
        diagnosis: 'Type 2 Diabetes',
        notes: 'Blood sugar levels improved. Continue with current medication.',
      },
    ],
    medications: [
      {
        name: 'Lisinopril',
        dosage: '20mg',
        frequency: 'Once daily',
        startDate: new Date('2025-07-20'),
        endDate: null,
        prescribedBy: 'Dr. John Smith',
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: new Date('2025-07-20'),
        endDate: null,
        prescribedBy: 'Dr. John Smith',
      },
      {
        name: 'Atorvastatin',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: new Date('2025-06-15'),
        endDate: null,
        prescribedBy: 'Dr. John Smith',
      },
    ],
    doctors: [
      {
        id: 'D-1001',
        name: 'Dr. John Smith',
        specialty: 'Cardiology',
        phone: '(123) 456-7891',
        email: 'john.smith@hospital.com',
      },
      {
        id: 'D-1002',
        name: 'Dr. Emily Johnson',
        specialty: 'Neurology',
        phone: '(123) 456-7892',
        email: 'emily.johnson@hospital.com',
      },
    ],
  };
  
  // Fetch patient data
  useEffect(() => {
    // Simulate API call with setTimeout
    setIsLoading(true);
    setTimeout(() => {
      setPatient(mockPatient);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Calculate BMI status
  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
    if (bmi < 25) return { label: 'Normal', color: 'success' };
    if (bmi < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'danger' };
  };
  
  // Handle request appointment button click
  const handleRequestAppointment = () => {
    navigate('/patient/appointments/request');
  };
  
  // Handle view all appointments button click
  const handleViewAllAppointments = () => {
    navigate('/patient/appointments');
  };
  
  // Handle view medical history button click
  const handleViewMedicalHistory = () => {
    navigate('/patient/history');
  };
  
  // If loading, show loading message
  if (isLoading) {
    return (
      <div className="patient-dashboard loading">
        <p>Loading patient information...</p>
      </div>
    );
  }
  
  // If patient not found, show error message
  if (!patient) {
    return (
      <div className="patient-dashboard not-found">
        <h1>Patient Information Not Found</h1>
        <p>Unable to load your patient information. Please try again later or contact support.</p>
      </div>
    );
  }
  
  // Get BMI status
  const bmiStatus = getBmiStatus(patient.bmi);
  
  return (
    <div className="patient-dashboard">
      <h1>My Dashboard</h1>
      
      {/* Personal Information */}
      <Card className="personal-info-card">
        <div className="personal-header">
          <div className="personal-avatar">
            <FaUserCircle size={80} />
          </div>
          <div className="personal-details">
            <h2>{patient.name}</h2>
            <div className="personal-meta">
              <span>{patient.age} years</span>
              <span>{patient.gender}</span>
              <span>ID: {patient.id}</span>
            </div>
            <div className="personal-contact">
              <span>{patient.phone}</span>
              <span>{patient.email}</span>
            </div>
          </div>
          <div className="personal-actions">
            <Button 
              variant="primary" 
              onClick={handleRequestAppointment}
            >
              <FaCalendarAlt /> Request Appointment
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Health Metrics */}
      <h2>My Health Metrics</h2>
      <div className="health-metrics">
        <Card className="metric-card">
          <div className="metric-icon">
            <FaHeartbeat size={32} />
          </div>
          <div className="metric-content">
            <h3>Blood Type</h3>
            <div className="metric-value">{patient.bloodType}</div>
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-icon">
            <FaRulerVertical size={32} />
          </div>
          <div className="metric-content">
            <h3>Height</h3>
            <div className="metric-value">{patient.height}</div>
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-icon">
            <FaWeight size={32} />
          </div>
          <div className="metric-content">
            <h3>Weight</h3>
            <div className="metric-value">{patient.weight}</div>
          </div>
        </Card>
        
        <Card className="metric-card">
          <div className="metric-icon">
            <FaWeight size={32} />
          </div>
          <div className="metric-content">
            <h3>BMI</h3>
            <div className="metric-value">
              {patient.bmi.toFixed(1)}
              <Badge 
                variant={bmiStatus.color} 
                pill
                className="bmi-badge"
              >
                {bmiStatus.label}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Vital Signs */}
      <Card title="Latest Vital Signs" className="vital-signs-card">
        <div className="vital-signs-date">
          Last updated: {new Date(patient.vitalSigns.lastUpdated).toLocaleDateString()}
        </div>
        <div className="vital-signs-grid">
          <div className="vital-sign">
            <h4>Blood Pressure</h4>
            <div className="vital-value">{patient.vitalSigns.bloodPressure}</div>
          </div>
          
          <div className="vital-sign">
            <h4>Heart Rate</h4>
            <div className="vital-value">{patient.vitalSigns.heartRate} bpm</div>
          </div>
          
          <div className="vital-sign">
            <h4>Temperature</h4>
            <div className="vital-value">{patient.vitalSigns.temperature}</div>
          </div>
          
          <div className="vital-sign">
            <h4>Respiratory Rate</h4>
            <div className="vital-value">{patient.vitalSigns.respiratoryRate} breaths/min</div>
          </div>
          
          <div className="vital-sign">
            <h4>Oxygen Saturation</h4>
            <div className="vital-value">{patient.vitalSigns.oxygenSaturation}</div>
          </div>
        </div>
      </Card>
      
      {/* Medical Conditions */}
      <Card title="Medical Conditions" className="conditions-card">
        <div className="conditions-section">
          <h3>Allergies</h3>
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
        </div>
        
        <div className="conditions-section">
          <h3>Chronic Conditions</h3>
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
        
        <div className="conditions-actions">
          <Button 
            variant="outline" 
            onClick={handleViewMedicalHistory}
          >
            View Full Medical History
          </Button>
        </div>
      </Card>
      
      {/* Current Medications */}
      <Card title="Current Medications" className="medications-card">
        {patient.medications.length > 0 ? (
          <div className="medications-list">
            {patient.medications.map((medication, index) => (
              <div key={index} className="medication-item">
                <div className="medication-icon">
                  <FaFileMedical />
                </div>
                <div className="medication-details">
                  <h4>{medication.name}</h4>
                  <div className="medication-meta">
                    <span>{medication.dosage}</span>
                    <span>{medication.frequency}</span>
                  </div>
                  <div className="medication-prescribed">
                    Prescribed by {medication.prescribedBy} on {new Date(medication.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-medications">
            <p>No current medications.</p>
          </div>
        )}
      </Card>
      
      {/* Upcoming Appointments */}
      <Card title="Upcoming Appointments" className="appointments-card">
        {patient.upcomingAppointments.length > 0 ? (
          <div className="appointments-list">
            {patient.upcomingAppointments.map((appointment, index) => (
              <div key={index} className="appointment-item">
                <div className="appointment-date">
                  <div className="date-day">
                    {appointment.date.getDate()}
                  </div>
                  <div className="date-month">
                    {appointment.date.toLocaleString('default', { month: 'short' })}
                  </div>
                </div>
                
                <div className="appointment-details">
                  <h4>{appointment.type} with {appointment.doctor}</h4>
                  <div className="appointment-meta">
                    <span>{appointment.time}</span>
                    <span>{appointment.department}</span>
                  </div>
                </div>
                
                <div className="appointment-status">
                  <Badge 
                    variant="primary" 
                    pill
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <p>No upcoming appointments.</p>
          </div>
        )}
        
        <div className="appointments-actions">
          <Button 
            variant="primary" 
            onClick={handleRequestAppointment}
          >
            <FaCalendarAlt /> Request Appointment
          </Button>
          <Button 
            variant="outline" 
            onClick={handleViewAllAppointments}
          >
            View All Appointments
          </Button>
        </div>
      </Card>
      
      {/* My Doctors */}
      <Card title="My Doctors" className="doctors-card">
        {patient.doctors.length > 0 ? (
          <div className="doctors-list">
            {patient.doctors.map((doctor, index) => (
              <div key={index} className="doctor-item">
                <div className="doctor-icon">
                  <FaUserMd />
                </div>
                <div className="doctor-details">
                  <h4>{doctor.name}</h4>
                  <div className="doctor-meta">
                    <span>{doctor.specialty}</span>
                  </div>
                  <div className="doctor-contact">
                    <span>{doctor.phone}</span>
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-doctors">
            <p>No assigned doctors.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;