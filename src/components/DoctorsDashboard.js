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
import './doctors-dashboard.css';
import './doctors-responsive.css';
import './premium-dashboard.css';
import './chart-enhancements.css';
import { apiFetch } from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('day');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
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

  const filteredAppointments = appointments.filter((appointment) => {
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

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
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
          <span className={`status-badge status-${variant}`}>
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
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApproveAppointment(row)}
                aria-label={`Approve appointment for ${row.patient_name}`}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRejectAppointment(row)}
                aria-label={`Reject appointment for ${row.patient_name}`}
              >
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStartConsultation(row)}
                aria-label={`Start consultation for ${row.patient_name}`}
                disabled={row.status === 'Rejected'}
              >
                Start
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleViewPatient(row)}
                aria-label={`View patient ${row.patient_name}`}
              >
                View
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => handleCreatePrescription(row)}
                aria-label={`Create prescription for ${row.patient_name}`}
                disabled={row.status === 'Rejected'}
              >
                Prescribe
              </Button>
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

  return (
    <div className="premium-dashboard doctors-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-header animate-slide-up">
        <h1 className="dashboard-title">
          <FaStethoscope className="page-icon" /> Doctor's Dashboard
        </h1>
      </div>
      
      {/* Welcome Card */}
      <div className="welcome-card animate-slide-up">
        <div className="card-body">
          <h3>Welcome Dr. {doctorName}</h3>
          <p>Here's your dashboard overview for today. You have {todayAppointments.length} appointments scheduled.</p>
        </div>
      </div>
      
      <Row className="stats-row animate-slide-up mb-4">
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaCalendarCheck className="icon-style text-blue-500" />
              <div>
                <h5>Total Appointments</h5>
                <p className="stat-number">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaNotesMedical className="icon-style text-green-500" />
              <div>
                <h5>Total Consultations</h5>
                <p className="stat-number">{stats.totalConsultations}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaUserFriends className="icon-style text-purple-500" />
              <div>
                <h5>Total Patients</h5>
                <p className="stat-number">{stats.totalPatients}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaFilePrescription className="icon-style text-teal-500" />
              <div>
                <h5>Total Prescriptions</h5>
                <p className="stat-number">{stats.totalPrescriptions}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaCalendarCheck className="icon-style text-blue-500" />
              <div>
                <h5>Today's Appointments</h5>
                <p className="stat-number">{todayAppointments.length}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaNotesMedical className="icon-style text-green-500" />
              <div>
                <h5>Completed Today</h5>
                <p className="stat-number">{completedAppointments}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6} sm={6} className="mb-3">
          <div className="stats-card premium-card h-100">
            <div className="card-body">
              <FaUserInjured className="icon-style text-yellow-500" />
              <div>
                <h5>Pending Today</h5>
                <p className="stat-number">{pendingTodayAppointments}</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col lg={4} md={12} className="mb-3">
          <div className="premium-card calendar-card">
            <div className="card-body">
              <h5 className="card-title">
                <FaCalendarCheck className="mr-2 text-blue-500" /> Calendar
              </h5>
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="border-none"
                aria-label="Select appointment date"
              />
              <p className="calendar-date">
                <strong>Selected Date:</strong> {date.toDateString()}
              </p>
              <div className="view-toggle">
                <button
                  className={`btn-premium ${view === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('day')}
                  aria-label="View appointments by day"
                >
                  Day
                </button>
                <button
                  className={`btn-premium ${view === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('week')}
                  aria-label="View appointments by week"
                >
                  Week
                </button>
                <button
                  className={`btn-premium ${view === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('month')}
                  aria-label="View appointments by month"
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <div className="premium-card chart-card">
            <div className="card-body">
              <h5 className="card-title">📊 Appointments by Day</h5>
              <div className="chart-container">
                <Pie 
                  data={appointmentData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <div className="premium-card chart-card">
            <div className="card-body">
              <h5 className="card-title">🧑‍🤝‍🧑 Patients by Gender</h5>
              <div className="chart-container">
                <Pie 
                  data={genderData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="premium-card appointment-card animate-slide-up">
            <div className="card-body">
              <h5 className="card-title">🔔 Pending Appointments (Require Approval)</h5>
              {pendingAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="premium-table appointment-table">
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
              ) : (
                <p className="no-data">No pending appointments requiring approval.</p>
              )}
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="premium-card appointment-card animate-slide-up">
            <div className="card-body">
              <h5 className="card-title">📅 All Appointments</h5>
              {filteredAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="premium-table appointment-table">
                    <thead>
                      <tr>
                        {appointmentColumns.map((col, index) => (
                          <th key={index}>{col.header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((row, index) => (
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
              ) : (
                <p className="no-data">No appointments scheduled for the selected date.</p>
              )}
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div className="premium-card appointment-card animate-slide-up">
            <div className="card-body">
              <h5 className="card-title">🕰️ Upcoming Appointments</h5>
              {upcomingAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="premium-table appointment-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map((appt, index) => (
                        <tr key={index}>
                          <td>{new Date(appt.appointment_date).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                appt.status === 'Pending'
                                  ? 'status-pending'
                                  : appt.status === 'Approved' || appt.status === 'Scheduled'
                                  ? 'status-approved'
                                  : appt.status === 'Checked In'
                                  ? 'status-approved'
                                  : appt.status === 'Completed'
                                  ? 'status-completed'
                                  : 'status-rejected'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td>{appt.notes}</td>
                          <td>
                            <button
                              className="btn-premium btn-outline-primary"
                              onClick={() => handleViewPatient(appt)}
                              aria-label={`View patient ${appt.patientName}`}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No upcoming appointments scheduled.</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;