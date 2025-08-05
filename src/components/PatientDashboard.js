import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserCircle, FaRulerVertical, FaHeartbeat, FaCalendarAlt, FaFileMedical, FaArrowLeft, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { getPatientByUserId, getPatientAppointments, getPatientPrescriptions } from '../services/patientService';
import './patient-dashboard.css';
import './patient-responsive.css';
import './premium-dashboard.css';

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in PatientDashboard:', error, errorInfo);
    toast.error('An error occurred while rendering the dashboard.');
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-message">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Memoized components
const AppointmentItem = React.memo(({ appointment }) => (
  <div className="appointment-item" role="listitem">
    <div className="appointment-date">
      <div className="date-day">{new Date(appointment.appointment_date).getDate()}</div>
      <div className="date-month">{new Date(appointment.appointment_date).toLocaleString('default', { month: 'short' })}</div>
    </div>
    <div className="appointment-details">
      <h4>Check-up with {appointment.doctor_name || appointment.staff_name || 'Doctor'}</h4>
      <div className="appointment-meta">
        <span>{new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{appointment.department_name || 'General'}</span>
      </div>
    </div>
    <div className="appointment-status">
      <Badge variant={
        appointment.status === 'Pending' ? 'warning' : 
        appointment.status === 'Approved' || appointment.status === 'Scheduled' ? 'success' : 
        appointment.status === 'Completed' ? 'info' :
        appointment.status === 'Rejected' || appointment.status === 'Cancelled' ? 'danger' : 'secondary'
      } pill>
        {appointment.status}
      </Badge>
    </div>
  </div>
));

const MedicationItem = React.memo(({ medication }) => (
  <div className="medication-item" role="listitem">
    <div className="medication-icon">
      <FaFileMedical />
    </div>
    <div className="medication-details">
      <h4>{medication.Medication || medication.medicine_name}</h4>
      <div className="medication-meta">
        <span>{medication.dosage}</span>
        <span>{medication.notes || 'As prescribed'}</span>
      </div>
      <div className="medication-prescribed">
        Prescribed by {medication.doctor_name || medication.staff_name || 'Doctor'} on {new Date(medication.date_issued).toLocaleDateString()}
      </div>
    </div>
  </div>
));

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data aligned with database schema
  const mockData = useMemo(() => ({
    patient: {
      patient_id: 1,
      user_id: 6,
      full_Name: 'Mark Leewe',
      phone: '5554443333',
      email: 'wara@example.com',
      gender: 'M',
      DOB: '1990-10-10',
      age: new Date().getFullYear() - new Date('1990-10-10').getFullYear(),
      blood_group: 'A+',
      BMI: '22.5',
    },
    appointments: [
      {
        appointment_id: 1,
        patient_id: 1,
        appointment_date: '2025-07-30T10:00:00',
        status: 'Approved',
        staff_name: 'Jane Smith',
        department_name: 'Cardiology',
        notes: 'Routine check-up',
      },
      {
        appointment_id: 2,
        patient_id: 1,
        appointment_date: '2025-08-15T14:30:00',
        status: 'Pending',
        staff_name: 'Jane Smith',
        department_name: 'Neurology',
        notes: 'Consultation',
      },
    ],
    prescriptions: [
      {
        prescription_id: 1,
        patient_id: 1,
        Medication: 'Atenolol',
        dosage: '50mg daily',
        date_issued: '2025-07-20T00:00:00',
        notes: 'Take with food',
        staff_name: 'Jane Smith',
      },
      {
        prescription_id: 2,
        patient_id: 1,
        Medication: 'Paracetamol',
        dosage: '500mg twice a day',
        date_issued: '2025-07-20T00:00:00',
        notes: 'Drink plenty of fluids',
        staff_name: 'Jane Smith',
      },
    ],
  }), []);

  // Fetch data from backend API
  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get user ID from localStorage (set during login)
        const userId = localStorage.getItem('user_id') || '6'; // Default for testing
        console.log('Fetching patient data for user ID:', userId);
        
        // Fetch patient data by user ID
        const patientData = await getPatientByUserId(userId);
        console.log('Patient data received:', patientData);
        
        if (!patientData) {
          throw new Error('Patient data not found');
        }

        // Calculate age
        const age = patientData.DOB ? 
          new Date().getFullYear() - new Date(patientData.DOB).getFullYear() : 0;

        setPatient({
          id: patientData.patient_id,
          patient_id: patientData.patient_id,
          user_id: patientData.user_id,
          full_Name: patientData.full_Name,
          phone: patientData.phone,
          email: patientData.email,
          gender: patientData.gender,
          DOB: patientData.DOB,
          age: age,
          blood_group: patientData.blood_group,
          BMI: patientData.BMI,
        });

        // Fetch appointments and prescriptions
        const [appointmentsData, prescriptionsData] = await Promise.all([
          getPatientAppointments(patientData.patient_id),
          getPatientPrescriptions(patientData.patient_id)
        ]);

        setAppointments(appointmentsData || []);
        setMedications(prescriptionsData || []);

      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err.message);
        toast.error(err.message);
        
        // Fallback to mock data if API fails
        setPatient(mockData.patient);
        setAppointments(mockData.appointments);
        setMedications(mockData.prescriptions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [mockData]);

  // Calculate BMI status
  const bmiStatus = useMemo(() => {
    const bmi = parseFloat(patient?.BMI);
    if (isNaN(bmi)) return { label: 'Unknown', color: 'secondary' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
    if (bmi < 25) return { label: 'Normal', color: 'success' };
    if (bmi < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'danger' };
  }, [patient?.BMI]);

  // Handlers
  const handleBack = () => navigate(-1);
  const handleRequestAppointment = () => navigate('/AppointmentRequest');
  const handleViewAllAppointments = () => navigate('/PatientAppointments');
  const handleViewAllPrescriptions = () => navigate('/PatientPrescriptions');

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading patient information...</p>
      </Container>
    );
  }

  if (error || !patient) {
    return (
      <Container className="patient-dashboard not-found">
        <h1>Patient Information Not Found</h1>
        <p>{error || 'Unable to load your patient information.'}</p>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <div className="premium-dashboard patient-dashboard">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="dashboard-header animate-slide-up">
          <button
            className="btn-premium btn-outline-primary"
            onClick={handleBack}
            onKeyDown={(e) => handleKeyDown(e, handleBack)}
            aria-label="Go back"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="dashboard-title">
            <FaUser className="page-icon" /> My Dashboard
          </h1>
        </div>

        <div className="welcome-card animate-slide-up">
          <div className="card-body">
            <div className="personal-header">
              <div className="personal-avatar">
                <FaUserCircle size={80} />
              </div>
              <div className="personal-details">
                <h2>{patient.full_Name}</h2>
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
                <button
                  className="btn-premium btn-primary"
                  onClick={handleRequestAppointment}
                  onKeyDown={(e) => handleKeyDown(e, handleRequestAppointment)}
                  aria-label="Request a new appointment"
                >
                  <FaCalendarAlt /> Request Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Health Metrics</h2>
        <Row className="stats-row animate-slide-up">
          <Col md={6}>
            <div className="stats-card premium-card">
              <div className="card-body">
                <FaHeartbeat className="icon-style text-danger" />
                <div>
                  <h5>Blood Group</h5>
                  <p className="stat-number">{patient.blood_group}</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stats-card premium-card">
              <div className="card-body">
                <FaRulerVertical className="icon-style text-blue-500" />
                <div>
                  <h5>BMI</h5>
                  <p className="stat-number">
                    {parseFloat(patient.BMI).toFixed(1)}
                    <span className={`status-badge status-${bmiStatus.color === 'success' ? 'approved' : bmiStatus.color === 'warning' ? 'pending' : 'rejected'}`}>
                      {bmiStatus.label}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="premium-card medications-card animate-slide-up">
          <div className="card-body">
            <h5 className="card-title">💊 Current Medications</h5>
          {medications.length > 0 ? (
            <div className="medications-list" role="list">
              {medications.map((medication) => (
                <MedicationItem key={medication.prescription_id} medication={medication} />
              ))}
            </div>
          ) : (
            <div className="no-medications">
              <p>No current medications.</p>
            </div>
          )}
            <div className="medications-actions">
              <button
                className="btn-premium btn-outline-primary"
                onClick={handleViewAllPrescriptions}
                onKeyDown={(e) => handleKeyDown(e, handleViewAllPrescriptions)}
                aria-label="View all prescriptions"
              >
                View All Prescriptions
              </button>
            </div>
          </div>
        </div>

        <div className="premium-card appointments-card animate-slide-up">
          <div className="card-body">
            <h5 className="card-title">📅 Upcoming Appointments</h5>
          {appointments.length > 0 ? (
            <div className="appointments-list" role="list">
              {appointments.map((appointment) => (
                <AppointmentItem key={appointment.appointment_id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>No upcoming appointments.</p>
            </div>
          )}
            <div className="appointments-actions">
              <button
                className="btn-premium btn-primary"
                onClick={handleRequestAppointment}
                onKeyDown={(e) => handleKeyDown(e, handleRequestAppointment)}
                aria-label="Request a new appointment"
              >
                <FaCalendarAlt /> Request Appointment
              </button>
              <button
                className="btn-premium btn-outline-primary"
                onClick={handleViewAllAppointments}
                onKeyDown={(e) => handleKeyDown(e, handleViewAllAppointments)}
                aria-label="View all appointments"
              >
                View All Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PatientDashboard;