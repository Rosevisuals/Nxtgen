import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClock, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from '../../components/ui/DatePicker';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

/**
 * AppointmentScheduling Component
 * 
 * Page for scheduling, rescheduling, and canceling appointments.
 */
const AppointmentScheduling = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
  const [isDeleteAppointmentModalOpen, setIsDeleteAppointmentModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    department: '',
    date: new Date(),
    time: '',
    duration: '30',
    type: '',
    notes: '',
  });
  
  // Mock appointments data (in a real app, this would come from an API)
  const mockAppointments = [
    {
      id: 1,
      patientId: 'P-10025',
      patientName: 'John Doe',
      doctorId: 'D-1001',
      doctorName: 'Dr. John Smith',
      department: 'Cardiology',
      date: new Date(),
      time: '09:00 AM',
      duration: '30',
      type: 'Check-up',
      status: 'Scheduled',
      notes: 'Follow-up on heart medication',
    },
    {
      id: 2,
      patientId: 'P-10032',
      patientName: 'Jane Smith',
      doctorId: 'D-1001',
      doctorName: 'Dr. John Smith',
      department: 'Cardiology',
      date: new Date(),
      time: '10:30 AM',
      duration: '30',
      type: 'New Patient',
      status: 'Checked In',
      notes: 'First visit, complaining of chest pain',
    },
    {
      id: 3,
      patientId: 'P-10018',
      patientName: 'Robert Johnson',
      doctorId: 'D-1002',
      doctorName: 'Dr. Emily Johnson',
      department: 'Neurology',
      date: new Date(),
      time: '01:00 PM',
      duration: '45',
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Post-surgery follow-up',
    },
    {
      id: 4,
      patientId: 'P-10045',
      patientName: 'Emily Davis',
      doctorId: 'D-1003',
      doctorName: 'Dr. Michael Wilson',
      department: 'Pediatrics',
      date: new Date(),
      time: '02:30 PM',
      duration: '30',
      type: 'Consultation',
      status: 'Scheduled',
      notes: 'Referred by Dr. Wilson',
    },
    {
      id: 5,
      patientId: 'P-10050',
      patientName: 'Michael Brown',
      doctorId: 'D-1004',
      doctorName: 'Dr. Sarah Wilson',
      department: 'Orthopedics',
      date: new Date(),
      time: '04:00 PM',
      duration: '30',
      type: 'Check-up',
      status: 'Cancelled',
      notes: 'Annual check-up',
    },
    // Tomorrow's appointments
    {
      id: 6,
      patientId: 'P-10060',
      patientName: 'Sarah Wilson',
      doctorId: 'D-1001',
      doctorName: 'Dr. John Smith',
      department: 'Cardiology',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '09:30 AM',
      duration: '30',
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Follow-up on medication',
    },
    {
      id: 7,
      patientId: 'P-10075',
      patientName: 'David Miller',
      doctorId: 'D-1002',
      doctorName: 'Dr. Emily Johnson',
      department: 'Neurology',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '11:00 AM',
      duration: '45',
      type: 'New Patient',
      status: 'Scheduled',
      notes: 'First visit',
    },
  ];
  
  // Mock patients data (in a real app, this would come from an API)
  const mockPatients = [
    { id: 'P-10025', name: 'John Doe' },
    { id: 'P-10032', name: 'Jane Smith' },
    { id: 'P-10018', name: 'Robert Johnson' },
    { id: 'P-10045', name: 'Emily Davis' },
    { id: 'P-10050', name: 'Michael Brown' },
    { id: 'P-10060', name: 'Sarah Wilson' },
    { id: 'P-10075', name: 'David Miller' },
  ];
  
  // Mock doctors data (in a real app, this would come from an API)
  const mockDoctors = [
    { id: 'D-1001', name: 'Dr. John Smith', department: 'Cardiology' },
    { id: 'D-1002', name: 'Dr. Emily Johnson', department: 'Neurology' },
    { id: 'D-1003', name: 'Dr. Michael Wilson', department: 'Pediatrics' },
    { id: 'D-1004', name: 'Dr. Sarah Wilson', department: 'Orthopedics' },
    { id: 'D-1005', name: 'Dr. Robert Brown', department: 'Dermatology' },
  ];
  
  // Appointment type options
  const appointmentTypeOptions = [
    { value: 'New Patient', label: 'New Patient' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Check-up', label: 'Check-up' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Procedure', label: 'Procedure' },
    { value: 'Emergency', label: 'Emergency' },
  ];
  
  // Duration options
  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
  ];
  
  // Time slot options (in a real app, this would be generated based on doctor's availability)
  const timeSlotOptions = [
    { value: '09:00 AM', label: '09:00 AM' },
    { value: '09:30 AM', label: '09:30 AM' },
    { value: '10:00 AM', label: '10:00 AM' },
    { value: '10:30 AM', label: '10:30 AM' },
    { value: '11:00 AM', label: '11:00 AM' },
    { value: '11:30 AM', label: '11:30 AM' },
    { value: '01:00 PM', label: '01:00 PM' },
    { value: '01:30 PM', label: '01:30 PM' },
    { value: '02:00 PM', label: '02:00 PM' },
    { value: '02:30 PM', label: '02:30 PM' },
    { value: '03:00 PM', label: '03:00 PM' },
    { value: '03:30 PM', label: '03:30 PM' },
    { value: '04:00 PM', label: '04:00 PM' },
    { value: '04:30 PM', label: '04:30 PM' },
  ];
  
  // Patient options for select
  const patientOptions = mockPatients.map(patient => ({
    value: patient.id,
    label: `${patient.name} (${patient.id})`,
  }));
  
  // Doctor options for select
  const doctorOptions = mockDoctors.map(doctor => ({
    value: doctor.id,
    label: `${doctor.name} - ${doctor.department}`,
  }));
  
  // Fetch appointments data
  useEffect(() => {
    // Simulate API call with setTimeout
    setIsLoading(true);
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Filter appointments based on selected date and search query
  useEffect(() => {
    if (appointments.length === 0) return;
    
    const filtered = appointments.filter(appointment => {
      // Check if the appointment date matches the selected date
      const appointmentDate = new Date(appointment.date);
      const selected = new Date(selectedDate);
      
      const dateMatches = 
        appointmentDate.getDate() === selected.getDate() &&
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getFullYear() === selected.getFullYear();
      
      // Check if the appointment matches the search query
      const query = searchQuery.toLowerCase();
      const searchMatches = query === '' || 
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.doctorName.toLowerCase().includes(query) ||
        appointment.department.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query);
      
      return dateMatches && searchMatches;
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, searchQuery]);
  
  // Table columns for appointments
  const appointmentColumns = [
    { 
      header: 'Time', 
      accessor: 'time',
      cell: (row) => (
        <div className="appointment-time">
          <FaClock className="time-icon" />
          <span>{row.time}</span>
          <span className="appointment-duration">({row.duration} min)</span>
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
    { 
      header: 'Doctor', 
      accessor: 'doctorName',
      cell: (row) => (
        <div className="doctor-info">
          <FaUserMd className="doctor-icon" />
          <span>{row.doctorName}</span>
        </div>
      ),
    },
    { header: 'Department', accessor: 'department' },
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
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {row.status === 'Scheduled' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditAppointment(row)}
                aria-label="Edit appointment"
              >
                <FaEdit />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteAppointment(row)}
                aria-label="Cancel appointment"
              >
                <FaTrash />
              </Button>
            </>
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
  
  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle new appointment button click
  const handleNewAppointment = () => {
    setFormData({
      patientId: '',
      patientName: '',
      doctorId: '',
      doctorName: '',
      department: '',
      date: new Date(),
      time: '',
      duration: '30',
      type: '',
      notes: '',
    });
    setIsNewAppointmentModalOpen(true);
  };
  
  // Handle edit appointment button click
  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      department: appointment.department,
      date: new Date(appointment.date),
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes,
    });
    setIsEditAppointmentModalOpen(true);
  };
  
  // Handle delete appointment button click
  const handleDeleteAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteAppointmentModalOpen(true);
  };
  
  // Handle view patient button click
  const handleViewPatient = (appointment) => {
    navigate(`/receptionist/patients/${appointment.patientId}`);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle patient select change
  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = mockPatients.find(p => p.id === patientId);
    
    setFormData({
      ...formData,
      patientId,
      patientName: patient ? patient.name : '',
    });
  };
  
  // Handle doctor select change
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = mockDoctors.find(d => d.id === doctorId);
    
    setFormData({
      ...formData,
      doctorId,
      doctorName: doctor ? doctor.name : '',
      department: doctor ? doctor.department : '',
    });
  };
  
  // Handle new appointment form submission
  const handleNewAppointmentSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    const newAppointment = {
      id: appointments.length + 1,
      patientId: formData.patientId,
      patientName: formData.patientName,
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      department: formData.department,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      status: 'Scheduled',
      notes: formData.notes,
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsNewAppointmentModalOpen(false);
    
    // Show success message
    alert('Appointment scheduled successfully!');
  };
  
  // Handle edit appointment form submission
  const handleEditAppointmentSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === currentAppointment.id) {
        return {
          ...appointment,
          patientId: formData.patientId,
          patientName: formData.patientName,
          doctorId: formData.doctorId,
          doctorName: formData.doctorName,
          department: formData.department,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          type: formData.type,
          notes: formData.notes,
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    setIsEditAppointmentModalOpen(false);
    
    // Show success message
    alert('Appointment updated successfully!');
  };
  
  // Handle delete appointment confirmation
  const handleDeleteAppointmentConfirm = () => {
    // In a real app, this would send the data to an API
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === currentAppointment.id) {
        return {
          ...appointment,
          status: 'Cancelled',
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    setIsDeleteAppointmentModalOpen(false);
    
    // Show success message
    alert('Appointment cancelled successfully!');
  };
  
  return (
    <div className="appointment-scheduling">
      <h1>
        <FaCalendarAlt className="page-icon" />
        Appointment Scheduling
      </h1>
      
      <div className="scheduling-controls">
        <Card className="date-picker-card">
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
          />
        </Card>
        
        <Card className="search-card">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </Card>
        
        <Card className="actions-card">
          <Button 
            variant="primary" 
            onClick={handleNewAppointment}
          >
            <FaPlus /> New Appointment
          </Button>
        </Card>
      </div>
      
      <Card title={`Appointments for ${selectedDate.toLocaleDateString()}`} className="appointments-card">
        {isLoading ? (
          <div className="loading">Loading appointments...</div>
        ) : filteredAppointments.length > 0 ? (
          <Table
            columns={appointmentColumns}
            data={filteredAppointments}
            striped
            hoverable
          />
        ) : (
          <div className="no-appointments">
            <p>No appointments scheduled for the selected date.</p>
          </div>
        )}
      </Card>
      
      {/* New Appointment Modal */}
      <Modal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        title="Schedule New Appointment"
      >
        <form onSubmit={handleNewAppointmentSubmit}>
          <div className="form-row">
            <Select
              label="Patient"
              name="patientId"
              value={formData.patientId}
              onChange={handlePatientChange}
              options={patientOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleDoctorChange}
              options={doctorOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Department"
              name="department"
              value={formData.department}
              readOnly
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Appointment Date"
              name="date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              minDate={new Date()}
              required
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Time Slot"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              options={timeSlotOptions}
              required
            />
            
            <Select
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              options={durationOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Appointment Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={appointmentTypeOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about the appointment"
              multiline
              rows={3}
            />
          </div>
          
          <Modal.Footer
            onCancel={() => setIsNewAppointmentModalOpen(false)}
            onConfirm={handleNewAppointmentSubmit}
            confirmText="Schedule Appointment"
          />
        </form>
      </Modal>
      
      {/* Edit Appointment Modal */}
      <Modal
        isOpen={isEditAppointmentModalOpen}
        onClose={() => setIsEditAppointmentModalOpen(false)}
        title="Edit Appointment"
      >
        <form onSubmit={handleEditAppointmentSubmit}>
          <div className="form-row">
            <Select
              label="Patient"
              name="patientId"
              value={formData.patientId}
              onChange={handlePatientChange}
              options={patientOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleDoctorChange}
              options={doctorOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Department"
              name="department"
              value={formData.department}
              readOnly
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Appointment Date"
              name="date"
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              minDate={new Date()}
              required
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Time Slot"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              options={timeSlotOptions}
              required
            />
            
            <Select
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              options={durationOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Appointment Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={appointmentTypeOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about the appointment"
              multiline
              rows={3}
            />
          </div>
          
          <Modal.Footer
            onCancel={() => setIsEditAppointmentModalOpen(false)}
            onConfirm={handleEditAppointmentSubmit}
            confirmText="Update Appointment"
          />
        </form>
      </Modal>
      
      {/* Delete Appointment Modal */}
      <Modal
        isOpen={isDeleteAppointmentModalOpen}
        onClose={() => setIsDeleteAppointmentModalOpen(false)}
        title="Cancel Appointment"
        size="sm"
      >
        <p>Are you sure you want to cancel the appointment for {currentAppointment?.patientName}?</p>
        <p>
          <strong>Date:</strong> {currentAppointment?.date.toLocaleDateString()}<br />
          <strong>Time:</strong> {currentAppointment?.time}<br />
          <strong>Doctor:</strong> {currentAppointment?.doctorName}
        </p>
        
        <Modal.Footer
          onCancel={() => setIsDeleteAppointmentModalOpen(false)}
          onConfirm={handleDeleteAppointmentConfirm}
          confirmText="Cancel Appointment"
        />
      </Modal>
    </div>
  );
};

export default AppointmentScheduling;