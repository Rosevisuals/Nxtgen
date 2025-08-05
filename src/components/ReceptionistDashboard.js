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
import './centered-layout.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [date] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
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
        return <span className={`badge badge-${variant === 'warning' ? 'warning' : variant === 'success' ? 'success' : variant === 'info' ? 'primary' : variant === 'danger' ? 'danger' : 'primary'}`}>{row.status}</span>;
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {(row.status === 'Approved' || row.status === 'Scheduled') && (
            <button 
              className="btn btn-success btn-sm"
              onClick={() => handleCheckIn(row)}
              aria-label={`Check in ${row.patient_name}`}
            >
              <FaUserCheck /> Check In
            </button>
          )}
          <button 
            className="btn btn-outline btn-sm"
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

  const appointmentFilterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Scheduled', label: 'Scheduled' },
        { value: 'Checked In', label: 'Checked In' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'department_name',
      label: 'Department',
      options: [
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Pediatrics', label: 'Pediatrics' },
        { value: 'General Medicine', label: 'General Medicine' }
      ]
    }
  ];

  const appointmentSortOptions = [
    { key: 'appointment_date', label: 'Time' },
    { key: 'patient_name', label: 'Patient Name' },
    { key: 'staff_name', label: 'Doctor Name' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <h1 className="page-title">
            <FaClipboardList /> Receptionist Dashboard
          </h1>
          <p className="page-subtitle">Welcome Back, {receptionistName}</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FaCalendarAlt /> {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <button className="btn btn-primary" onClick={handleNewPatient}>
                  <FaUserPlus /> Register Patient
                </button>
              </div>
              <div className="col-4">
                <button className="btn btn-primary" onClick={handleNewAppointment}>
                  <FaCalendarAlt /> New Appointment
                </button>
              </div>
              <div className="col-4">
                <button className="btn btn-primary" onClick={handlePatientSearch}>
                  <FaSearch /> Find Patient
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body text-center">
                <FaCalendarAlt style={{fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{todayAppointments.length}</h3>
                <p style={{color: '#64748b', margin: 0}}>Today's Appointments</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body text-center">
                <FaUserCheck style={{fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{checkedInPatients.length}</h3>
                <p style={{color: '#64748b', margin: 0}}>Checked In</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-body text-center">
                <FaClock style={{fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{upcomingAppointments.length}</h3>
                <p style={{color: '#64748b', margin: 0}}>Upcoming (3 Hours)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📅 Today's Appointments</h2>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
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
        {upcomingAppointments.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🕰️ Upcoming Appointments (Next 3 Hours)</h2>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;