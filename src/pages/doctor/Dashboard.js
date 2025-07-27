import React, { useState } from 'react';
import { FaCalendarAlt, FaUserInjured, FaNotesMedical, FaClock } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DatePicker from '../../components/ui/DatePicker';
import Table from '../../components/ui/Table';
import { useNavigate } from 'react-router-dom';

/**
 * Doctor Dashboard Component
 * 
 * Displays today's and upcoming appointments for the doctor.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('day'); // 'day', 'week', or 'month'
  
  // Mock appointments data (in a real app, this would come from an API)
  const appointments = [
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
    // Tomorrow's appointments
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
  
  // Filter appointments based on selected date and view
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const selected = new Date(selectedDate);
    
    if (view === 'day') {
      return (
        appointmentDate.getDate() === selected.getDate() &&
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getFullYear() === selected.getFullYear()
      );
    } else if (view === 'week') {
      // Get the week start and end dates
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
  
  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }
    
    // If dates are the same, sort by time
    const timeA = a.time;
    const timeB = b.time;
    
    return timeA.localeCompare(timeB);
  });
  
  // Get today's appointments
  const today = new Date();
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Get upcoming appointments (excluding today)
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const todayDate = new Date();
    
    // Reset time to compare just the dates
    todayDate.setHours(0, 0, 0, 0);
    const appointmentDateOnly = new Date(appointmentDate);
    appointmentDateOnly.setHours(0, 0, 0, 0);
    
    return appointmentDateOnly > todayDate;
  }).slice(0, 5); // Get only the next 5 upcoming appointments
  
  // Table columns for appointments
  const appointmentColumns = [
    { 
      header: 'Time', 
      accessor: 'time',
      cell: (row) => (
        <div className="appointment-time">
          <FaClock className="time-icon" />
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
          <Badge 
            variant={variant}
            pill
          >
            {row.status}
          </Badge>
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
          >
            Start
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewPatient(row)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];
  
  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Handle view change
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  // Handle start consultation
  const handleStartConsultation = (appointment) => {
    navigate(`/doctor/consultations/new?patientId=${appointment.patientId}&appointmentId=${appointment.id}`);
  };
  
  // Handle view patient
  const handleViewPatient = (appointment) => {
    navigate(`/doctor/patients/${appointment.patientId}`);
  };
  
  // Get summary stats
  const totalAppointmentsToday = todayAppointments.length;
  const completedAppointments = todayAppointments.filter(a => a.status === 'Completed').length;
  const pendingAppointments = todayAppointments.filter(a => a.status === 'Scheduled' || a.status === 'Checked In').length;
  
  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="dashboard-summary">
        <Card className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: 'var(--primary-main)' }}>
            <FaCalendarAlt />
          </div>
          <div className="summary-content">
            <h3>{totalAppointmentsToday}</h3>
            <p>Today's Appointments</p>
          </div>
        </Card>
        
        <Card className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: 'var(--status-success)' }}>
            <FaNotesMedical />
          </div>
          <div className="summary-content">
            <h3>{completedAppointments}</h3>
            <p>Completed</p>
          </div>
        </Card>
        
        <Card className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: 'var(--accent-main)' }}>
            <FaUserInjured />
          </div>
          <div className="summary-content">
            <h3>{pendingAppointments}</h3>
            <p>Pending</p>
          </div>
        </Card>
      </div>
      
      {/* Appointments Calendar */}
      <Card title="Appointments" className="appointments-card">
        <div className="calendar-toolbar">
          <div className="date-picker-container">
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          
          <div className="view-toggle">
            <Button 
              variant={view === 'day' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => handleViewChange('day')}
            >
              Day
            </Button>
            <Button 
              variant={view === 'week' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => handleViewChange('week')}
            >
              Week
            </Button>
            <Button 
              variant={view === 'month' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => handleViewChange('month')}
            >
              Month
            </Button>
          </div>
        </div>
        
        {sortedAppointments.length > 0 ? (
          <Table
            columns={appointmentColumns}
            data={sortedAppointments}
            striped
            hoverable
          />
        ) : (
          <div className="no-appointments">
            <p>No appointments scheduled for the selected date.</p>
          </div>
        )}
      </Card>
      
      {/* Upcoming Appointments */}
      <Card title="Upcoming Appointments" className="upcoming-appointments-card">
        {upcomingAppointments.length > 0 ? (
          <div className="upcoming-list">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="upcoming-item">
                <div className="upcoming-date">
                  <div className="date-day">
                    {new Date(appointment.date).getDate()}
                  </div>
                  <div className="date-month">
                    {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
                  </div>
                </div>
                
                <div className="upcoming-details">
                  <div className="upcoming-patient">
                    <strong>{appointment.patientName}</strong>
                    <span className="patient-id">{appointment.patientId}</span>
                  </div>
                  <div className="upcoming-info">
                    <span className="upcoming-time">{appointment.time}</span>
                    <span className="upcoming-type">{appointment.type}</span>
                  </div>
                  <div className="upcoming-notes">{appointment.notes}</div>
                </div>
                
                <div className="upcoming-actions">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewPatient(appointment)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <p>No upcoming appointments scheduled.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;