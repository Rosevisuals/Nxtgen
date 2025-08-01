import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserCircle, FaRulerVertical, FaHeartbeat, FaCalendarAlt, FaFileMedical, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { getPatientByUserId, getPatientAppointments, getPatientPrescriptions } from '../services/patientService';
import './patient-dashboard.css';

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
      <Badge variant={appointment.status === 'Pending' ? 'warning' : appointment.status === 'Approved' ? 'success' : 'danger'} pill>
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
        
        // Fetch patient data by user ID
        const patientData = await getPatientByUserId(userId);
        
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
      <Container className="patient-dashboard">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="dashboard-header">
          <Button
            variant="outline-secondary"
            onClick={handleBack}
            onKeyDown={(e) => handleKeyDown(e, handleBack)}
            aria-label="Go back"
            className="back-button"
          >
            <FaArrowLeft className="mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaUserCircle className="mr-2" /> My Dashboard
          </h1>
        </div>

        <Card className="personal-info-card mb-4">
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
              <Button
                variant="primary"
                onClick={handleRequestAppointment}
                onKeyDown={(e) => handleKeyDown(e, handleRequestAppointment)}
                aria-label="Request a new appointment"
              >
                <FaCalendarAlt className="mr-1" /> Request Appointment
              </Button>
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Health Metrics</h2>
        <Row className="health-metrics mb-4">
          <Col md={3}>
            <Card className="metric-card">
              <div className="metric-icon">
                <FaHeartbeat size={32} />
              </div>
              <div className="metric-content">
                <h3>Blood Group</h3>
                <div className="metric-value">{patient.blood_group}</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card">
              <div className="metric-icon">
                <FaRulerVertical size={32} />
              </div>
              <div className="metric-content">
                <h3>BMI</h3>
                <div className="metric-value">
                  {parseFloat(patient.BMI).toFixed(1)}
                  <Badge variant={bmiStatus.color} pill className="bmi-badge">
                    {bmiStatus.label}
                  </Badge>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Current Medications" className="medications-card mb-4">
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
            <Button
              variant="outline-primary"
              onClick={handleViewAllPrescriptions}
              onKeyDown={(e) => handleKeyDown(e, handleViewAllPrescriptions)}
              aria-label="View all prescriptions"
            >
              View All Prescriptions
            </Button>
          </div>
        </Card>

        <Card title="Upcoming Appointments" className="appointments-card mb-4">
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
            <Button
              variant="primary"
              onClick={handleRequestAppointment}
              onKeyDown={(e) => handleKeyDown(e, handleRequestAppointment)}
              aria-label="Request a new appointment"
            >
              <FaCalendarAlt className="mr-1" /> Request Appointment
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleViewAllAppointments}
              onKeyDown={(e) => handleKeyDown(e, handleViewAllAppointments)}
              aria-label="View all appointments"
            >
              View All Appointments
            </Button>
          </div>
        </Card>
      </Container>
    </ErrorBoundary>
  );
};

export default PatientDashboard;