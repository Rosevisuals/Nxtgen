import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserPlus, FaSearch, FaClock, FaUserCheck, FaArrowLeft, FaClipboardList } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Table from './ui/Table';
import { useNavigate } from 'react-router-dom';
import { getTodayAppointments, updateAppointmentStatus } from '../services/receptionistService';
import './receptionist-dashboard.css';
import './receptionist-responsive.css';
import './premium-dashboard.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [date] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const receptionistName = localStorage.getItem('user_name') || 'Receptionist';

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await getTodayAppointments();
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load today\'s appointments');
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [navigate]);

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
           appointment.status !== 'Rejected' && appointment.status !== 'Cancelled';
  });

  const checkedInPatients = todayAppointments.filter(appointment => 
    appointment.status === 'Checked In'
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
          case 'Pending': variant = 'warning'; break;
          case 'Approved': 
          case 'Scheduled': variant = 'success'; break;
          case 'Checked In': variant = 'info'; break;
          case 'Completed': variant = 'primary'; break;
          case 'Rejected':
          case 'Cancelled': variant = 'danger'; break;
          default: variant = 'secondary';
        }
        return <Badge variant={variant} pill>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {(row.status === 'Approved' || row.status === 'Scheduled') && (
            <button 
              className="btn-premium btn-success"
              onClick={() => handleCheckIn(row)}
              aria-label={`Check in ${row.patient_name}`}
            >
              <FaUserCheck /> Check In
            </button>
          )}
          <button 
            className="btn-premium btn-outline-primary"
            onClick={() => handleViewPatient(row)}
            aria-label={`View patient ${row.patient_name}`}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const handleCheckIn = async (appointment) => {
    try {
      await updateAppointmentStatus(appointment.appointment_id, 'Checked In');
      setAppointments(prev => prev.map(appt => 
        appt.appointment_id === appointment.appointment_id ? { ...appt, status: 'Checked In' } : appt
      ));
      toast.success(`Checked in ${appointment.patient_name}`);
    } catch (error) {
      console.error('Error checking in patient:', error);
      toast.error('Failed to check in patient');
    }
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
    navigate('/PatientSearch');
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
    <div className="premium-dashboard receptionist-dashboard">
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
          <FaClipboardList className="page-icon" /> Receptionist Dashboard
        </h1>
      </div>
      <div className="welcome-card animate-slide-up">
        <div className="card-body">
          <h3>Welcome Back, {receptionistName}</h3>
          <p>Manage appointments and patient information efficiently.</p>
        </div>
      </div>
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
      <div className="premium-card quick-actions-card animate-slide-up">
        <div className="card-body">
          <h5 className="card-title">⚡ Quick Actions</h5>
          <div className="quick-actions">
            <button className="btn-premium btn-primary" onClick={handleNewPatient} aria-label="Register new patient">
              <FaUserPlus /> Register Patient
            </button>
            <button className="btn-premium btn-primary" onClick={handleNewAppointment} aria-label="Schedule new appointment">
              <FaCalendarAlt /> New Appointment
            </button>
            <button className="btn-premium btn-primary" onClick={handlePatientSearch} aria-label="Search patients">
              <FaSearch /> Find Patient
            </button>
          </div>
        </div>
      </div>
      <div className="stats-row animate-slide-up">
        <div className="row">
          <div className="col-md-4">
            <div className="stats-card premium-card">
              <div className="card-body">
                <FaCalendarAlt className="icon-style text-blue-500" />
                <div>
                  <h5>Today's Appointments</h5>
                  <p className="stat-number">{todayAppointments.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card premium-card">
              <div className="card-body">
                <FaUserCheck className="icon-style text-green-500" />
                <div>
                  <h5>Checked In</h5>
                  <p className="stat-number">{checkedInPatients.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card premium-card">
              <div className="card-body">
                <FaClock className="icon-style text-yellow-500" />
                <div>
                  <h5>Upcoming (Next 3 Hours)</h5>
                  <p className="stat-number">{upcomingAppointments.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="premium-card appointments-card animate-slide-up">
        <div className="card-body">
          <h5 className="card-title">📅 Today's Appointments</h5>
          <div className="table-responsive">
            <table className="premium-table">
              <thead>
                <tr>
                  {appointmentColumns.map((col, index) => (
                    <th key={index}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((row, index) => (
                  <tr key={index}>
                    {appointmentColumns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="premium-card upcoming-appointments-card animate-slide-up">
        <div className="card-body">
          <h5 className="card-title">🕰️ Upcoming Appointments (Next 3 Hours)</h5>
          <div className="table-responsive">
            {upcomingAppointments.length > 0 ? (
              <table className="premium-table">
                <thead>
                  <tr>
                    {appointmentColumns.map((col, index) => (
                      <th key={index}>{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((row, index) => (
                    <tr key={index}>
                      {appointmentColumns.map((col, colIndex) => (
                        <td key={colIndex}>
                          {col.cell ? col.cell(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-appointments">
                <p>No upcoming appointments in the next 3 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;