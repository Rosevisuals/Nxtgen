import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserPlus, FaSearch, FaClock, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Table from './ui/Table';
import { useNavigate } from 'react-router-dom';
import './receptionist-dashboard.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [date] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock receptionist name (replace with API data later)
  const receptionistName = 'Harriet';

  // Mock appointments based on database schema
  const mockAppointments = [
    {
      appointment_id: 1,
      patient_id: 1,
      patient_name: 'Mark Leewe',
      appointment_date: '2025-07-30T09:00:00',
      staff_name: 'Jane Smith',
      department_name: 'Cardiology',
      status: 'Approved',
    },
    {
      appointment_id: 2,
      patient_id: 2,
      patient_name: 'Tom Cruse',
      appointment_date: '2025-07-30T10:30:00',
      staff_name: 'Jane Smith',
      department_name: 'Cardiology',
      status: 'Approved',
    },
    {
      appointment_id: 3,
      patient_id: 1,
      patient_name: 'Mark Leewe',
      appointment_date: '2025-07-30T13:00:00',
      staff_name: 'Jane Smith',
      department_name: 'Neurology',
      status: 'Pending',
    },
    {
      appointment_id: 4,
      patient_id: 2,
      patient_name: 'Tom Cruse',
      appointment_date: '2025-07-30T14:30:00',
      staff_name: 'Jane Smith',
      department_name: 'Pediatrics',
      status: 'Pending',
    },
    {
      appointment_id: 5,
      patient_id: 1,
      patient_name: 'Mark Leewe',
      appointment_date: '2025-07-30T16:00:00',
      staff_name: 'Jane Smith',
      department_name: 'Cardiology',
      status: 'Declined',
    },
  ];

  // Fetch appointments (mock for now, API-ready)
  useEffect(() => {
    setIsLoading(true);

    // TODO: Uncomment and configure for API integration
    /*
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    const API_KEY = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY || localStorage.getItem('authToken')}`,
    };

    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`${API_BASE_URL}/appointments?date=${today}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch appointments.');
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
    */

    // Mock data loading
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter appointments for today and next 3 hours
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointment_date);
    return appointmentDate.toDateString() === date.toDateString();
  });

  const upcomingAppointments = todayAppointments.filter(appointment => {
    const appointmentTime = new Date(appointment.appointment_date);
    const currentTime = new Date();
    const threeHoursLater = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
    return appointmentTime >= currentTime && 
           appointmentTime <= threeHoursLater && 
           appointment.status !== 'Declined';
  });

  const checkedInPatients = todayAppointments.filter(appointment => 
    appointment.status === 'Approved' && appointment.appointment_date <= new Date().toISOString()
  );

  const appointmentColumns = [
    { 
      header: 'Time', 
      accessor: 'appointment_date',
      cell: (row) => (
        <div className="appointment-time">
          <FaClock className="time-icon" />
          <span>{new Date(row.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    { 
      header: 'Patient', 
      accessor: 'patient_name',
      cell: (row) => (
        <div className="patient-info">
          <span className="patient-name">{row.patient_name}</span>
          <span className="patient-id">ID: {row.patient_id}</span>
        </div>
      ),
    },
    { header: 'Doctor', accessor: 'staff_name' },
    { header: 'Department', accessor: 'department_name' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        switch (row.status) {
          case 'Approved': variant = 'success'; break;
          case 'Pending': variant = 'warning'; break;
          case 'Declined': variant = 'danger'; break;
          default: variant = 'primary';
        }
        return <Badge variant={variant} pill>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {row.status === 'Pending' && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => handleCheckIn(row)}
              aria-label={`Check in ${row.patient_name}`}
            >
              <FaUserCheck /> Check In
            </Button>
          )}
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={() => handleViewPatient(row)}
            aria-label={`View patient ${row.patient_name}`}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const handleCheckIn = (appointment) => {
    // TODO: Implement API call to update appointment status
    /*
    fetch(`${API_BASE_URL}/appointments/${appointment.appointment_id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Approved' }),
    })
      .then(res => res.json())
      .then(data => {
        setAppointments(prev => prev.map(appt => 
          appt.appointment_id === appointment.appointment_id ? { ...appt, status: 'Approved' } : appt
        ));
        toast.success(`Checked in ${appointment.patient_name}`);
      })
      .catch(err => toast.error('Failed to check in patient.'));
    */
    setAppointments(prev => prev.map(appt => 
      appt.appointment_id === appointment.appointment_id ? { ...appt, status: 'Approved' } : appt
    ));
    toast.success(`Checked in ${appointment.patient_name}`);
  };

  const handleViewPatient = (appointment) => {
    navigate(`/receptionist/patients/${appointment.patient_id}`);
  };

  const handleNewPatient = () => {
    navigate('/PatientRegister');
  };

  const handleNewAppointment = () => {
    navigate('/NewAppointment');
  };

  const handlePatientSearch = () => {
    navigate('/PatientsSearch');
  };

  const handleBack = () => navigate(-1);

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  if (isLoading) {
    return (
      <div className="receptionist-dashboard loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="receptionist-dashboard">
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
        <h1 className="dashboard-title">
          <FaUserCheck className="dashboard-icon" /> Receptionist Dashboard
        </h1>
      </div>
      <Card className="welcome-card">
        <div className="welcome-content">
          <h2>Welcome Back, {receptionistName}</h2>
          <p>Manage appointments and patient information efficiently.</p>
        </div>
      </Card>
      <div className="date-display">
        <h2>
          <FaCalendarAlt className="calendar-icon" />
          {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
      </div>
      <Card title="Quick Actions" className="quick-actions-card">
        <div className="quick-actions">
          <Button variant="primary" onClick={handleNewPatient} aria-label="Register new patient">
            <FaUserPlus /> Register Patient
          </Button>
          <Button variant="primary" onClick={handleNewAppointment} aria-label="Schedule new appointment">
            <FaCalendarAlt /> New Appointment
          </Button>
          <Button variant="primary" onClick={handlePatientSearch} aria-label="Search patients">
            <FaSearch /> Find Patient
          </Button>
        </div>
      </Card>
      <div className="dashboard-summary">
        <Card className="summary-card">
          <div className="summary-icon">
            <FaCalendarAlt />
          </div>
          <div className="summary-content">
            <h3>{todayAppointments.length}</h3>
            <p>Today's Appointments</p>
          </div>
        </Card>
        <Card className="summary-card">
          <div className="summary-icon">
            <FaUserCheck />
          </div>
          <div className="summary-content">
            <h3>{checkedInPatients.length}</h3>
            <p>Checked In</p>
          </div>
        </Card>
        <Card className="summary-card">
          <div className="summary-icon">
            <FaClock />
          </div>
          <div className="summary-content">
            <h3>{upcomingAppointments.length}</h3>
            <p>Upcoming (Next 3 Hours)</p>
          </div>
        </Card>
      </div>
      <Card title="Today's Appointments" className="appointments-card">
        <Table columns={appointmentColumns} data={todayAppointments} striped hoverable />
      </Card>
      <Card title="Upcoming Appointments (Next 3 Hours)" className="upcoming-appointments-card">
        {upcomingAppointments.length > 0 ? (
          <Table columns={appointmentColumns} data={upcomingAppointments} striped hoverable />
        ) : (
          <div className="no-appointments">
            <p>No upcoming appointments in the next 3 hours.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;