import React, { useState } from 'react';
import { FaCalendarAlt, FaUserPlus, FaSearch, FaFileInvoiceDollar, FaClock, FaUserCheck } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { useNavigate } from 'react-router-dom';

/**
 * Receptionist Dashboard Component
 * 
 * Displays today's appointments and quick actions for receptionists.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [date] = useState(new Date());
  
  // Mock appointments data (in a real app, this would come from an API)
  const todayAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 'P-10025',
      time: '09:00 AM',
      doctor: 'Dr. John Smith',
      department: 'Cardiology',
      status: 'Scheduled',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 'P-10032',
      time: '10:30 AM',
      doctor: 'Dr. John Smith',
      department: 'Cardiology',
      status: 'Checked In',
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 'P-10018',
      time: '01:00 PM',
      doctor: 'Dr. Emily Johnson',
      department: 'Neurology',
      status: 'Scheduled',
    },
    {
      id: 4,
      patientName: 'Emily Davis',
      patientId: 'P-10045',
      time: '02:30 PM',
      doctor: 'Dr. Michael Wilson',
      department: 'Pediatrics',
      status: 'Scheduled',
    },
    {
      id: 5,
      patientName: 'Michael Brown',
      patientId: 'P-10050',
      time: '04:00 PM',
      doctor: 'Dr. Sarah Wilson',
      department: 'Orthopedics',
      status: 'Cancelled',
    },
  ];
  
  // Get upcoming appointments (next 3 hours)
  const currentTime = new Date();
  const upcomingAppointments = todayAppointments.filter(appointment => {
    const [hours, minutes] = appointment.time.match(/(\d+):(\d+)/).slice(1, 3);
    const isPM = appointment.time.includes('PM');
    
    let appointmentHours = parseInt(hours);
    if (isPM && appointmentHours !== 12) {
      appointmentHours += 12;
    } else if (!isPM && appointmentHours === 12) {
      appointmentHours = 0;
    }
    
    const appointmentTime = new Date();
    appointmentTime.setHours(appointmentHours, parseInt(minutes), 0, 0);
    
    // Check if appointment is in the next 3 hours and not cancelled
    const threeHoursLater = new Date(currentTime);
    threeHoursLater.setHours(currentTime.getHours() + 3);
    
    return appointmentTime >= currentTime && 
           appointmentTime <= threeHoursLater && 
           appointment.status !== 'Cancelled';
  });
  
  // Get checked-in patients
  const checkedInPatients = todayAppointments.filter(appointment => 
    appointment.status === 'Checked In'
  );
  
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
    { header: 'Doctor', accessor: 'doctor' },
    { header: 'Department', accessor: 'department' },
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
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {row.status === 'Scheduled' && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => handleCheckIn(row)}
            >
              <FaUserCheck /> Check In
            </Button>
          )}
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
  
  // Handle check-in
  const handleCheckIn = (appointment) => {
    // In a real app, this would update the appointment status in the API
    alert(`Checked in ${appointment.patientName}`);
  };
  
  // Handle view patient
  const handleViewPatient = (appointment) => {
    navigate(`/receptionist/patients/${appointment.patientId}`);
  };
  
  // Handle new patient registration
  const handleNewPatient = () => {
    navigate('/receptionist/patients/register');
  };
  
  // Handle new appointment
  const handleNewAppointment = () => {
    navigate('/receptionist/appointments/new');
  };
  
  // Handle patient search
  const handlePatientSearch = () => {
    navigate('/receptionist/patients');
  };
  
  // Handle new bill
  const handleNewBill = () => {
    navigate('/receptionist/billing/new');
  };
  
  return (
    <div className="receptionist-dashboard">
      <h1>Receptionist Dashboard</h1>
      
      {/* Date Display */}
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
      
      {/* Quick Actions */}
      <Card title="Quick Actions" className="quick-actions-card">
        <div className="quick-actions">
          <Button 
            variant="primary" 
            onClick={handleNewPatient}
          >
            <FaUserPlus /> Register Patient
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNewAppointment}
          >
            <FaCalendarAlt /> New Appointment
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePatientSearch}
          >
            <FaSearch /> Find Patient
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNewBill}
          >
            <FaFileInvoiceDollar /> Create Bill
          </Button>
        </div>
      </Card>
      
      {/* Summary Cards */}
      <div className="dashboard-summary">
        <Card className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: 'var(--primary-main)' }}>
            <FaCalendarAlt />
          </div>
          <div className="summary-content">
            <h3>{todayAppointments.length}</h3>
            <p>Today's Appointments</p>
          </div>
        </Card>
        
        <Card className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: 'var(--status-success)' }}>
            <FaUserCheck />
          </div>
          <div className="summary-content">
            <h3>{checkedInPatients.length}</h3>
            <p>Checked In</p>
          </div>
        </Card>
        
        <Card className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: 'var(--accent-main)' }}>
            <FaClock />
          </div>
          <div className="summary-content">
            <h3>{upcomingAppointments.length}</h3>
            <p>Upcoming (Next 3 Hours)</p>
          </div>
        </Card>
      </div>
      
      {/* Today's Appointments */}
      <Card title="Today's Appointments" className="appointments-card">
        <Table
          columns={appointmentColumns}
          data={todayAppointments}
          striped
          hoverable
        />
      </Card>
      
      {/* Upcoming Appointments */}
      <Card title="Upcoming Appointments (Next 3 Hours)" className="upcoming-appointments-card">
        {upcomingAppointments.length > 0 ? (
          <Table
            columns={appointmentColumns}
            data={upcomingAppointments}
            striped
            hoverable
          />
        ) : (
          <div className="no-appointments">
            <p>No upcoming appointments in the next 3 hours.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;