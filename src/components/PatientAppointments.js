import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import './patient-dashboard.css'; // Reuse dashboard styles

const AppointmentItem = React.memo(({ appointment }) => (
  <div className="appointment-item" role="listitem">
    <div className="appointment-date">
      <div className="date-day">{appointment.date.getDate()}</div>
      <div className="date-month">{appointment.date.toLocaleString('default', { month: 'short' })}</div>
    </div>
    <div className="appointment-details">
      <h4>{appointment.type} with {appointment.doctor}</h4>
      <div className="appointment-meta">
        <span>{appointment.time}</span>
        <span>{appointment.department}</span>
        <span>{appointment.status}</span>
      </div>
      {appointment.diagnosis && (
        <div className="appointment-diagnosis">
          <strong>Diagnosis:</strong> {appointment.diagnosis}
        </div>
      )}
      {appointment.notes && (
        <div className="appointment-notes">
          <strong>Notes:</strong> {appointment.notes}
        </div>
      )}
    </div>
    <div className="appointment-status">
      <Badge variant={appointment.status === 'Scheduled' ? 'primary' : 'success'} pill>
        {appointment.status}
      </Badge>
    </div>
  </div>
));

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data (to be replaced with API call)
  const mockAppointments = useMemo(() => [
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
  ], []);

  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    // const token = localStorage.getItem('authToken');
    // fetch('/api/patient/appointments', {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setAppointments(data);
    //     setIsLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to fetch appointments.');
    //     setIsLoading(false);
    //     toast.error('Failed to load appointments.');
    //   });
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, [mockAppointments]);

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading appointments...</p>
      </Container>
    );
  }

  if (error || !appointments.length) {
    return (
      <Container className="patient-dashboard not-found">
        <h1>No Appointments Found</h1>
        <p>{error || 'No appointments available.'}</p>
      </Container>
    );
  }

  return (
    <Container className="patient-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaCalendarAlt className="mr-2" /> My Appointments
      </h1>
      <Card title="All Appointments" className="appointments-card">
        <div className="appointments-list" role="list">
          {appointments.map((appointment, index) => (
            <AppointmentItem key={index} appointment={appointment} />
          ))}
        </div>
      </Card>
    </Container>
  );
};

export default PatientAppointments;