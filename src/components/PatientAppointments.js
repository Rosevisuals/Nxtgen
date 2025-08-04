import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { getPatientByUserId, getPatientAppointments } from '../services/patientService';
import './patient-dashboard.css';
import './patient-responsive.css';

const AppointmentItem = React.memo(({ appointment }) => {
  const appointmentDate = new Date(appointment.appointment_date);
  return (
    <div className="appointment-item" role="listitem">
      <div className="appointment-date">
        <div className="date-day">{appointmentDate.getDate()}</div>
        <div className="date-month">{appointmentDate.toLocaleString('default', { month: 'short' })}</div>
      </div>
      <div className="appointment-details">
        <h4>Appointment with {appointment.doctor_name || 'Doctor'}</h4>
        <div className="appointment-meta">
          <span>{appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{appointment.department_name || 'General'}</span>
        </div>
        {appointment.notes && (
          <div className="appointment-notes">
            <strong>Notes:</strong> {appointment.notes}
          </div>
        )}
      </div>
      <div className="appointment-status">
        <Badge variant={appointment.status === 'Pending' ? 'warning' : appointment.status === 'Approved' ? 'success' : 'danger'} pill>
          {appointment.status}
        </Badge>
      </div>
    </div>
  );
});

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('Please login to view appointments');
        }

        // Get patient data first
        const patientData = await getPatientByUserId(userId);
        if (!patientData) {
          throw new Error('Patient data not found');
        }

        setPatientName(patientData.full_Name || 'Patient');

        // Get appointments
        const appointmentsData = await getPatientAppointments(patientData.patient_id);
        setAppointments(appointmentsData || []);

      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading appointments...</p>
      </Container>
    );
  }

  return (
    <Container className="patient-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-header">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/PatientDashboard')}
          className="back-button"
        >
          <FaArrowLeft className="mr-1" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaCalendarAlt className="mr-2" /> {patientName}'s Appointments
        </h1>
      </div>

      {error ? (
        <Card className="error-card">
          <div className="error-message">
            <h3>Error Loading Appointments</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      ) : (
        <Card title="All Appointments" className="appointments-card">
          {appointments.length > 0 ? (
            <div className="appointments-list" role="list">
              {appointments.map((appointment) => (
                <AppointmentItem key={appointment.appointment_id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <FaCalendarAlt size={48} className="text-gray-400 mb-3" />
              <h3>No Appointments Found</h3>
              <p>You don't have any appointments scheduled yet.</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/AppointmentRequest')}
              >
                Request Appointment
              </Button>
            </div>
          )}
        </Card>
      )}
    </Container>
  );
};

export default PatientAppointments;