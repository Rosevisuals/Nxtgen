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
import './centered-layout.css';

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
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
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
      <div className="centered-container">
        <div className="centered-content">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="page-header">
            <h1 className="page-title">
              <FaUser /> My Dashboard
            </h1>
            <p className="page-subtitle">Welcome, {patient.full_Name}</p>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-2 text-center">
                  <FaUserCircle style={{fontSize: '4rem', color: '#2563eb'}} />
                </div>
                <div className="col-8">
                  <h2 style={{margin: '0 0 0.5rem 0', color: '#1e293b'}}>{patient.full_Name}</h2>
                  <p style={{margin: '0.25rem 0', color: '#64748b'}}>{patient.age} years • {patient.gender} • ID: {patient.id}</p>
                  <p style={{margin: '0.25rem 0', color: '#64748b'}}>{patient.phone} • {patient.email}</p>
                </div>
                <div className="col-2 text-center">
                  <button
                    className="btn btn-primary"
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

          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-body text-center">
                  <FaHeartbeat style={{fontSize: '2rem', color: '#ef4444', marginBottom: '0.5rem'}} />
                  <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{patient.blood_group}</h3>
                  <p style={{color: '#64748b', margin: 0}}>Blood Group</p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-body text-center">
                  <FaRulerVertical style={{fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem'}} />
                  <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
                    {parseFloat(patient.BMI).toFixed(1)}
                    <span className={`badge badge-${bmiStatus.color === 'success' ? 'success' : bmiStatus.color === 'warning' ? 'warning' : 'danger'}`} style={{marginLeft: '0.5rem', fontSize: '0.75rem'}}>
                      {bmiStatus.label}
                    </span>
                  </h3>
                  <p style={{color: '#64748b', margin: 0}}>BMI</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">💊 Current Medications</h2>
            </div>
            <div className="card-body">
              {medications.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Prescribed By</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.map((medication) => (
                        <tr key={medication.prescription_id}>
                          <td>{medication.Medication || medication.medicine_name}</td>
                          <td>{medication.dosage}</td>
                          <td>{medication.doctor_name || medication.staff_name || 'Doctor'}</td>
                          <td>{new Date(medication.date_issued).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center" style={{color: '#64748b', padding: '2rem'}}>No current medications.</p>
              )}
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline"
                  onClick={handleViewAllPrescriptions}
                  onKeyDown={(e) => handleKeyDown(e, handleViewAllPrescriptions)}
                  aria-label="View all prescriptions"
                >
                  View All Prescriptions
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📅 Upcoming Appointments</h2>
            </div>
            <div className="card-body">
              {appointments.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.appointment_id}>
                          <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                          <td>{new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>{appointment.doctor_name || appointment.staff_name || 'Doctor'}</td>
                          <td>{appointment.department_name || 'General'}</td>
                          <td>
                            <span className={`badge badge-${
                              appointment.status === 'Pending' ? 'warning' : 
                              appointment.status === 'Approved' || appointment.status === 'Scheduled' ? 'success' : 
                              appointment.status === 'Completed' ? 'primary' :
                              appointment.status === 'Rejected' || appointment.status === 'Cancelled' ? 'danger' : 'primary'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center" style={{color: '#64748b', padding: '2rem'}}>No upcoming appointments.</p>
              )}
              <div className="text-center mt-3">
                <div className="row">
                  <div className="col-6">
                    <button
                      className="btn btn-primary"
                      onClick={handleRequestAppointment}
                      onKeyDown={(e) => handleKeyDown(e, handleRequestAppointment)}
                      aria-label="Request a new appointment"
                    >
                      <FaCalendarAlt /> Request Appointment
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn btn-outline"
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
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PatientDashboard;