import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { FaCalendarCheck, FaUserFriends, FaFilePrescription, FaClock, FaUserInjured, FaNotesMedical } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './doctors-dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('day');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalConsultations: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    appointmentsByDay: [0, 0, 0, 0, 0],
    patientsByGender: [0, 0, 0],
  });

  const mockAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P-10025',
      time: '09:00 AM',
      date: new Date(),
      type: 'Check-up',
      status: 'Scheduled',
      notes: 'Follow-up on heart medication',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P-10032',
      time: '10:30 AM',
      date: new Date(),
      type: 'New Patient',
      status: 'Checked In',
      notes: 'First visit, complaining of chest pain',
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 'P-10018',
      time: '01:00 PM',
      date: new Date(),
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Post-surgery follow-up',
    },
    {
      id: 4,
      patientName: 'Emily Davis',
      patientId: 'P-10045',
      time: '02:30 PM',
      date: new Date(),
      type: 'Consultation',
      status: 'Scheduled',
      notes: 'Referred by Dr. Wilson',
    },
    {
      id: 5,
      patientName: 'Michael Brown',
      patientId: 'P-10050',
      time: '04:00 PM',
      date: new Date(),
      type: 'Check-up',
      status: 'Scheduled',
      notes: 'Annual check-up',
    },
    {
      id: 6,
      patientName: 'Sarah Wilson',
      patientId: 'P-10060',
      time: '09:30 AM',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Follow-up on medication',
    },
    {
      id: 7,
      patientName: 'David Miller',
      patientId: 'P-10075',
      time: '11:00 AM',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      type: 'New Patient',
      status: 'Scheduled',
      notes: 'First visit',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setAppointments(mockAppointments);
      setStats({
        totalAppointments: 52,
        totalConsultations: 59,
        totalPatients: 89,
        totalPrescriptions: 34,
        appointmentsByDay: [12, 9, 14, 7, 10],
        patientsByGender: [60, 40, 5],
      });
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
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
    return false;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }
    return a.time.localeCompare(b.time);
  });

  const today = new Date();
  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
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
  const pendingAppointments = todayAppointments.filter((a) => a.status === 'Scheduled' || a.status === 'Checked In').length;

  const appointmentColumns = [
    {
      header: 'Time',
      accessor: 'time',
      cell: (row) => (
        <div className="appointment-time">
          <FaClock className="mr-2 text-blue-500" />
          <span>{row.time}</span>
        </div>
      ),
    },
    {
      header: 'Patient',
      accessor: 'patientName',
      cell: (row) => (
        <div className="patient-info">
          <span className="patient-name">{row.patientName}</span>
          <span className="patient-id">{row.patientId}</span>
        </div>
      ),
    },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        switch (row.status) {
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
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleStartConsultation(row)}
            aria-label={`Start consultation for ${row.patientName}`}
          >
            Start
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewPatient(row)}
            aria-label={`View patient ${row.patientName}`}
          >
            View
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleCreatePrescription(row)}
            aria-label={`Create prescription for ${row.patientName}`}
          >
            Prescribe
          </Button>
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

  if (loading) {
    return (
      <Container className="doctors-dashboard loading">
        <p>Loading dashboard data...</p>
      </Container>
    );
  }

  return (
    <Container className="doctors-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="dashboard-title">
        <span role="img" aria-label="Doctor">👨‍⚕️</span> Doctor's Dashboard
      </h1>
      <Row className="stats-row">
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaCalendarCheck className="icon-style text-blue-500" />
              <h5>Total Appointments</h5>
              <p className="stat-number">{stats.totalAppointments}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaNotesMedical className="icon-style text-green-500" />
              <h5>Total Consultations</h5>
              <p className="stat-number">{stats.totalConsultations}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaUserFriends className="icon-style text-purple-500" />
              <h5>Total Patients</h5>
              <p className="stat-number">{stats.totalPatients}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaFilePrescription className="icon-style text-teal-500" />
              <h5>Total Prescriptions</h5>
              <p className="stat-number">{stats.totalPrescriptions}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaCalendarCheck className="icon-style text-blue-500" />
              <h5>Today's Appointments</h5>
              <p className="stat-number">{todayAppointments.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaNotesMedical className="icon-style text-green-500" />
              <h5>Completed Today</h5>
              <p className="stat-number">{completedAppointments}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stats-card">
            <Card.Body>
              <FaUserInjured className="icon-style text-yellow-500" />
              <h5>Pending Today</h5>
              <p className="stat-number">{pendingAppointments}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={6}>
          <Card className="calendar-card">
            <Card.Body>
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
                <Button
                  variant={view === 'day' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleViewChange('day')}
                  aria-label="View appointments by day"
                >
                  Day
                </Button>
                <Button
                  variant={view === 'week' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleViewChange('week')}
                  aria-label="View appointments by week"
                >
                  Week
                </Button>
                <Button
                  variant={view === 'month' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleViewChange('month')}
                  aria-label="View appointments by month"
                >
                  Month
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">📊 Appointments by Day</h5>
              <Pie data={appointmentData} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h5 className="card-title">🧑‍🤝‍🧑 Patients by Gender</h5>
              <Pie data={genderData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="appointment-card">
            <Card.Body>
              <h5 className="card-title">Appointments</h5>
              {sortedAppointments.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover className="appointment-table">
                    <thead>
                      <tr>
                        {appointmentColumns.map((col, index) => (
                          <th key={index}>{col.header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAppointments.map((row, index) => (
                        <tr key={index}>
                          {appointmentColumns.map((col, colIndex) => (
                            <td key={colIndex}>
                              {col.cell ? col.cell(row) : row[col.accessor]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="no-data">No appointments scheduled for the selected date.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="appointment-card">
            <Card.Body>
              <h5 className="card-title">Upcoming Appointments</h5>
              {upcomingAppointments.length > 0 ? (
                <div className="table-responsive">
                  <Table className="appointment-table">
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
                          <td>{formatDate(appt.date)}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                appt.status === 'Scheduled'
                                  ? 'status-primary'
                                  : appt.status === 'Checked In'
                                  ? 'status-success'
                                  : 'status-danger'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td>{appt.notes}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewPatient(appt)}
                              aria-label={`View patient ${appt.patientName}`}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="no-data">No upcoming appointments scheduled.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;