import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { FaCalendarCheck, FaUserFriends, FaFilePrescription, FaClock, FaUserInjured, FaNotesMedical, FaStethoscope } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './centered-layout.css';
import { apiFetch } from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('day');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('Doctor');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalConsultations: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    appointmentsByDay: [0, 0, 0, 0, 0],
    patientsByGender: [0, 0, 0],
  });



  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get doctor name from localStorage
        const userName = localStorage.getItem('user_name');
        if (userName) {
          setDoctorName(userName);
        }

        // Fetch appointments
        const appointmentsData = await apiFetch('/appointments');
        console.log('Fetched appointments:', appointmentsData);
        toast.info(`Loaded ${appointmentsData?.length || 0} appointments`);
        setAppointments(appointmentsData || []);

        // Fetch patients for stats
        const patientsData = await apiFetch('/patients');
        const patients = patientsData || [];

        // Calculate stats
        const allAppointments = appointmentsData || [];
        const totalAppointments = allAppointments.length;
        const totalPatients = patients.length;
        
        // Calculate gender distribution
        const maleCount = patients.filter(p => p.gender === 'M').length;
        const femaleCount = patients.filter(p => p.gender === 'F').length;
        const otherCount = patients.length - maleCount - femaleCount;

        setStats({
          totalAppointments,
          totalConsultations: allAppointments.filter(a => a.status === 'Completed').length,
          totalPatients,
          totalPrescriptions: Math.floor(totalAppointments * 0.6),
          appointmentsByDay: [12, 9, 14, 7, 10], // Mock for now
          patientsByGender: [maleCount, femaleCount, otherCount],
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const calendarFilteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const selected = new Date(date);
    if (view === 'day') {
      return (
        appointmentDate.getDate() === selected.getDate() &&
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getFullYear() === selected.getFullYear()
      );
    } else if (view === 'week') {
      const weekStart = new Date(selected);
      weekStart.setDate(selected.getDate() - selected.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    } else if (view === 'month') {
      return (
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getFullYear() === selected.getFullYear()
      );
    }
    return true;
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'Pending');
  const approvedAppointments = appointments.filter(apt => apt.status === 'Approved' || apt.status === 'Scheduled');

  const sortedAppointments = [...calendarFilteredAppointments].sort((a, b) => {
    const dateA = new Date(a.appointment_date);
    const dateB = new Date(b.appointment_date);
    return dateA - dateB;
  });

  const today = new Date();
  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const appointmentDateOnly = new Date(appointmentDate);
      appointmentDateOnly.setHours(0, 0, 0, 0);
      return appointmentDateOnly > todayDate;
    })
    .slice(0, 5);

  const appointmentData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: 'Appointments',
        data: stats.appointmentsByDay,
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6610f2'],
      },
    ],
  };

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        label: 'Patients by Gender',
        data: stats.patientsByGender,
        backgroundColor: ['#6f42c1', '#e83e8c', '#20c997'],
      },
    ],
  };

  const completedAppointments = todayAppointments.filter((a) => a.status === 'Completed').length;
  const pendingTodayAppointments = todayAppointments.filter((a) => a.status === 'Pending' || a.status === 'Approved' || a.status === 'Scheduled' || a.status === 'Checked In').length;

  const appointmentColumns = [
    {
      header: 'Date & Time',
      accessor: 'appointment_date',
      cell: (row) => (
        <div className="appointment-time">
          <FaClock className="mr-2 text-blue-500" />
          <div>
            <div>{new Date(row.appointment_date).toLocaleDateString()}</div>
            <div>{new Date(row.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
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
    { header: 'Department', accessor: 'department_name' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        switch (row.status) {
          case 'Pending':
            variant = 'warning';
            break;
          case 'Approved':
          case 'Scheduled':
            variant = 'primary';
            break;
          case 'Checked In':
            variant = 'success';
            break;
          case 'In Progress':
            variant = 'warning';
            break;
          case 'Completed':
            variant = 'info';
            break;
          case 'Rejected':
          case 'Cancelled':
            variant = 'danger';
            break;
          default:
            variant = 'primary';
        }
        return (
          <span className={`badge badge-${variant === 'warning' ? 'warning' : variant === 'success' ? 'success' : variant === 'info' ? 'primary' : variant === 'danger' ? 'danger' : 'primary'}`}>
            {row.status}
          </span>
        );
      },
    },
    { header: 'Notes', accessor: 'notes' },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {row.status === 'Pending' ? (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleApproveAppointment(row)}
                aria-label={`Approve appointment for ${row.patient_name}`}
                style={{marginRight: '0.5rem'}}
              >
                Approve
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleRejectAppointment(row)}
                aria-label={`Reject appointment for ${row.patient_name}`}
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleStartConsultation(row)}
                aria-label={`Start consultation for ${row.patient_name}`}
                disabled={row.status === 'Rejected'}
                style={{marginRight: '0.5rem'}}
              >
                Start
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleViewPatient(row)}
                aria-label={`View patient ${row.patient_name}`}
                style={{marginRight: '0.5rem'}}
              >
                View
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleCreatePrescription(row)}
                aria-label={`Create prescription for ${row.patient_name}`}
                disabled={row.status === 'Rejected'}
              >
                Prescribe
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleDateChange = (newDate) => {
    if (!newDate) {
      toast.error('Please select a valid date.');
      return;
    }
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleStartConsultation = (appointment) => {
    navigate(`/doctor/consultations/new?patientId=${appointment.patientId}&appointmentId=${appointment.id}`);
  };

  const handleViewPatient = (appointment) => {
    navigate(`/doctor/patients/${appointment.patientId}`);
  };

  const handleCreatePrescription = (appointment) => {
    navigate(`/doctor/prescriptions/new?patientId=${appointment.patientId}`);
  };

  const handleApproveAppointment = async (appointment) => {
    try {
      const response = await apiFetch(`/appointments/${appointment.appointment_id}/approve`, {
        method: 'PUT'
      });
      toast.success('Appointment approved successfully');
      // Refresh appointments
      const appointmentsData = await apiFetch('/appointments');
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Failed to approve appointment');
    }
  };

  const handleRejectAppointment = async (appointment) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    try {
      const response = await apiFetch(`/appointments/${appointment.appointment_id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      toast.success('Appointment rejected successfully');
      // Refresh appointments
      const appointmentsData = await apiFetch('/appointments');
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  if (loading) {
    return (
      <Container className="doctors-dashboard loading">
        <p>Loading dashboard data...</p>
      </Container>
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
        { value: 'In Progress', label: 'In Progress' },
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
    { key: 'appointment_date', label: 'Date' },
    { key: 'patient_name', label: 'Patient Name' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <h1 className="page-title">
            <FaStethoscope /> Doctor's Dashboard
          </h1>
          <p className="page-subtitle">Welcome Dr. {doctorName}</p>
        </div>
      

      
        <div className="row">
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaCalendarCheck style={{fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{stats.totalAppointments}</h3>
                <p style={{color: '#64748b', margin: 0}}>Total Appointments</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaNotesMedical style={{fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{stats.totalConsultations}</h3>
                <p style={{color: '#64748b', margin: 0}}>Consultations</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaUserFriends style={{fontSize: '2rem', color: '#8b5cf6', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{stats.totalPatients}</h3>
                <p style={{color: '#64748b', margin: 0}}>Total Patients</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaFilePrescription style={{fontSize: '2rem', color: '#0d9488', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{stats.totalPrescriptions}</h3>
                <p style={{color: '#64748b', margin: 0}}>Prescriptions</p>
              </div>
            </div>
          </div>
        </div>


        {pendingAppointments.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🔔 Pending Appointments (Require Approval)</h2>
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
                    {pendingAppointments.map((row, index) => (
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📅 All Appointments</h2>
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
                  {appointments.map((row, index) => (
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


      </div>
    </div>
  );
};

export default DoctorDashboard;