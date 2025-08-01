import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaClock, FaSearch, FaPlus, FaEdit, FaTrash, FaCheck, FaFileExport, FaBell } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './appointment-scheduling.css';
import './DoctorsSidebar';
/**
 * AppointmentScheduling Component
 * Page for doctors to schedule, reschedule, cancel, approve, and manage appointments.
 * @returns {JSX.Element} The appointment scheduling component
 */
const AppointmentScheduling = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  // Modal states
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
  const [isDeleteAppointmentModalOpen, setIsDeleteAppointmentModalOpen] = useState(false);
  const [isApproveAppointmentModalOpen, setIsApproveAppointmentModalOpen] = useState(false);
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
    status: 'Scheduled',
    notes: '',
  });

  // Mock data
  const mockAppointments = useMemo(() => [
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
      status: 'Pending Approval',
      notes: 'First visit, complaining of chest pain',
    },
    // Add more mock appointments as needed
  ], []);

  const mockPatients = useMemo(() => [
    { id: 'P-10025', name: 'John Doe' },
    { id: 'P-10032', name: 'Jane Smith' },
    // Add more patients
  ], []);

  const mockDoctors = useMemo(() => [
    { id: 'D-1001', name: 'Dr. John Smith', department: 'Cardiology' },
    { id: 'D-1002', name: 'Dr. Emily Johnson', department: 'Neurology' },
    // Add more doctors
  ], []);

  // Options
  const appointmentTypeOptions = [
    { value: 'New Patient', label: 'New Patient' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Check-up', label: 'Check-up' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Procedure', label: 'Procedure' },
    { value: 'Emergency', label: 'Emergency' },
  ];

  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
  ];

  const timeSlotOptions = [
    { value: '09:00 AM', label: '09:00 AM' },
    { value: '09:30 AM', label: '09:30 AM' },
    // Add more time slots
  ];

  const patientOptions = mockPatients.map(patient => ({
    value: patient.id,
    label: `${patient.name} (${patient.id})`,
  }));

  const doctorOptions = mockDoctors.map(doctor => ({
    value: doctor.id,
    label: `${doctor.name} - ${doctor.department}`,
  }));

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...[...new Set(mockDoctors.map(d => d.department))].map(dep => ({
      value: dep,
      label: dep,
    })),
  ];

  const statusOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Pending Approval', label: 'Pending Approval' },
    { value: 'Checked In', label: 'Checked In' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  // Fetch data
  useEffect(() => {
    // TODO: Fetch appointments, patients, and doctors from API
    /*
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/doctor/appointments', {
          headers: { 'X-API-Key': process.env.REACT_APP_API_KEY },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        if (!Array.isArray(data.appointments)) throw new Error('Invalid appointment data');
        setAppointments(data.appointments);
        setIsLoading(false);
      } catch (error) {
        toast.error(`Error fetching appointments: ${error.message}`);
        setAppointments(mockAppointments);
        setIsLoading(false);
      }
    };
    fetchData();
    */

    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, [mockAppointments]);

  // Filter appointments
  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const selected = new Date(selectedDate);
      const dateMatches =
        appointmentDate.getDate() === selected.getDate() &&
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getFullYear() === selected.getFullYear();

      const query = searchQuery.toLowerCase();
      const searchMatches = query === '' ||
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.doctorName.toLowerCase().includes(query) ||
        appointment.department.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query);

      const doctorMatches = filterDoctor === '' || appointment.doctorId === filterDoctor;
      const departmentMatches = filterDepartment === '' || appointment.department === filterDepartment;

      return dateMatches && searchMatches && doctorMatches && departmentMatches;
    });
    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, searchQuery, filterDoctor, filterDepartment]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = mockPatients.find(p => p.id === patientId);
    setFormData({
      ...formData,
      patientId,
      patientName: patient ? patient.name : '',
    });
  };

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

  // Handle new appointment
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
      status: 'Scheduled',
      notes: '',
    });
    setIsNewAppointmentModalOpen(true);
  };

  const handleNewAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.time || !formData.type) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // TODO: POST to /api/doctor/appointments
    /*
    try {
      const response = await fetch('/api/doctor/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to schedule appointment');
      const newAppointment = await response.json();
      setAppointments([...appointments, newAppointment]);
      toast.success('Appointment scheduled successfully!');
    } catch (error) {
      toast.error(`Error scheduling appointment: ${error.message}`);
    }
    */

    const newAppointment = { id: appointments.length + 1, ...formData };
    setAppointments([...appointments, newAppointment]);
    setIsNewAppointmentModalOpen(false);
    toast.success('Appointment scheduled successfully!');
  };

  // Handle edit appointment
  const handleEditAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setFormData({ ...appointment, date: new Date(appointment.date) });
    setIsEditAppointmentModalOpen(true);
  };

  const handleEditAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.time || !formData.type) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // TODO: PUT to /api/doctor/appointments/:id
    /*
    try {
      const response = await fetch(`/api/doctor/appointments/${currentAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update appointment');
      const updatedAppointment = await response.json();
      setAppointments(appointments.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
      toast.success('Appointment updated successfully!');
    } catch (error) {
      toast.error(`Error updating appointment: ${error.message}`);
    }
    */

    const updatedAppointments = appointments.map(a =>
      a.id === currentAppointment.id ? { ...a, ...formData } : a
    );
    setAppointments(updatedAppointments);
    setIsEditAppointmentModalOpen(false);
    toast.success('Appointment updated successfully!');
  };

  // Handle approve appointment
  const handleApproveAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setIsApproveAppointmentModalOpen(true);
  };

  const handleApproveAppointmentConfirm = async () => {
    // TODO: PATCH to /api/doctor/appointments/:id/approve
    /*
    try {
      const response = await fetch(`/api/doctor/appointments/${currentAppointment.id}/approve`, {
        method: 'PATCH',
        headers: { 'X-API-Key': process.env.REACT_APP_API_KEY },
      });
      if (!response.ok) throw new Error('Failed to approve appointment');
      const updatedAppointment = await response.json();
      setAppointments(appointments.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
      toast.success('Appointment approved successfully!');
    } catch (error) {
      toast.error(`Error approving appointment: ${error.message}`);
    }
    */

    const updatedAppointments = appointments.map(a =>
      a.id === currentAppointment.id ? { ...a, status: 'Scheduled' } : a
    );
    setAppointments(updatedAppointments);
    setIsApproveAppointmentModalOpen(false);
    toast.success('Appointment approved successfully!');
  };

  // Handle delete appointment
  const handleDeleteAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteAppointmentModalOpen(true);
  };

  const handleDeleteAppointmentConfirm = async () => {
    // TODO: PATCH to /api/doctor/appointments/:id/cancel
    /*
    try {
      const response = await fetch(`/api/doctor/appointments/${currentAppointment.id}/cancel`, {
        method: 'PATCH',
        headers: { 'X-API-Key': process.env.REACT_APP_API_KEY },
      });
      if (!response.ok) throw new Error('Failed to cancel appointment');
      const updatedAppointment = await response.json();
      setAppointments(appointments.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
      toast.success('Appointment cancelled successfully!');
    } catch (error) {
      toast.error(`Error cancelling appointment: ${error.message}`);
    }
    */

    const updatedAppointments = appointments.map(a =>
      a.id === currentAppointment.id ? { ...a, status: 'Cancelled' } : a
    );
    setAppointments(updatedAppointments);
    setIsDeleteAppointmentModalOpen(false);
    toast.success('Appointment cancelled successfully!');
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status) => {
    if (selectedAppointments.length === 0) {
      toast.error('Please select at least one appointment.');
      return;
    }

    // TODO: PATCH to /api/doctor/appointments/bulk
    /*
    try {
      const response = await fetch('/api/doctor/appointments/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({
          appointmentIds: selectedAppointments,
          status,
        }),
      });
      if (!response.ok) throw new Error('Failed to update appointments');
      const updatedAppointments = await response.json();
      setAppointments(appointments.map(a =>
        updatedAppointments.find(u => u.id === a.id) || a
      ));
      toast.success(`Selected appointments updated to ${status}`);
    } catch (error) {
      toast.error(`Error updating appointments: ${error.message}`);
    }
    */

    const updatedAppointments = appointments.map(a =>
      selectedAppointments.includes(a.id) ? { ...a, status } : a
    );
    setAppointments(updatedAppointments);
    setSelectedAppointments([]);
    toast.success(`Selected appointments updated to ${status}`);
  };

  // Handle export to CSV
  const handleExportAppointments = () => {
    const headers = ['ID', 'Patient', 'Doctor', 'Department', 'Date', 'Time', 'Duration', 'Type', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredAppointments.map(a =>
        [
          a.id,
          `"${a.patientName}"`,
          `"${a.doctorName}"`,
          a.department,
          new Date(a.date).toLocaleDateString(),
          a.time,
          a.duration,
          a.type,
          a.status,
          `"${a.notes}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Appointments exported successfully!');
  };

  // Handle send reminder
  const handleSendReminder = (appointment) => {
    // TODO: POST to /api/doctor/appointments/:id/reminder
    /*
    try {
      const response = await fetch(`/api/doctor/appointments/${appointment.id}/reminder`, {
        method: 'POST',
        headers: { 'X-API-Key': process.env.REACT_APP_API_KEY },
      });
      if (!response.ok) throw new Error('Failed to send reminder');
      toast.success(`Reminder sent to ${appointment.patientName}`);
    } catch (error) {
      toast.error(`Error sending reminder: ${error.message}`);
    }
    */

    toast.success(`Reminder sent to ${appointment.patientName}`);
  };

  // Handle view patient
  const handleViewPatient = (appointment) => {
    navigate(`/doctor/patients/${appointment.patientId}`);
  };

  // Handle checkbox selection
  const handleSelectAppointment = (id) => {
    setSelectedAppointments(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Table columns
  const appointmentColumns = [
    {
      header: 'Select',
      cell: (row) => (
        <Form.Check
          type="checkbox"
          checked={selectedAppointments.includes(row.id)}
          onChange={() => handleSelectAppointment(row.id)}
          aria-label={`Select appointment for ${row.patientName}`}
        />
      ),
    },
    {
      header: 'Time',
      accessor: 'time',
      cell: (row) => (
        <div className="flex items-center">
          <FaClock className="mr-2 text-blue-500" />
          <span>{row.time}</span>
          <span className="ml-2 text-gray-500">({row.duration} min)</span>
        </div>
      ),
    },
    {
      header: 'Patient',
      accessor: 'patientName',
      cell: (row) => (
        <div>
          <span className="font-semibold">{row.patientName}</span>
          <span className="block text-gray-500">{row.patientId}</span>
        </div>
      ),
    },
    {
      header: 'Doctor',
      accessor: 'doctorName',
      cell: (row) => (
        <div className="flex items-center">
          <FaUserMd className="mr-2 text-blue-500" />
          <span>{row.doctorName}</span>
        </div>
      ),
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase().replace(' ', '-')}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions flex space-x-2">
          {row.status === 'Pending Approval' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleApproveAppointment(row)}
              aria-label={`Approve appointment for ${row.patientName}`}
            >
              <FaCheck />
            </Button>
          )}
          {['Scheduled', 'Pending Approval'].includes(row.status) && (
            <>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleEditAppointment(row)}
                aria-label={`Edit appointment for ${row.patientName}`}
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteAppointment(row)}
                aria-label={`Cancel appointment for ${row.patientName}`}
              >
                <FaTrash />
              </Button>
            </>
          )}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewPatient(row)}
            aria-label={`View patient ${row.patientName}`}
          >
            View
          </Button>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => handleSendReminder(row)}
            aria-label={`Send reminder to ${row.patientName}`}
          >
            <FaBell />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container className="appointment-scheduling mt-5">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaCalendarAlt className="mr-2" /> Appointment Scheduling
      </h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <Row className="scheduling-controls mb-4">
        <Col md={3}>
          <Card className="p-3">
            <Form.Group>
              <Form.Label>Select Date</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                className="form-control"
                dateFormat="MM/dd/yyyy"
                aria-label="Select appointment date"
              />
            </Form.Group>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3">
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <div className="flex items-center">
                <FaSearch className="mr-2 text-gray-500" />
                <Form.Control
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search appointments"
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3">
            <Form.Group>
              <Form.Label>Filter by Doctor</Form.Label>
              <Form.Select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                aria-label="Filter by doctor"
              >
                <option value="">All Doctors</option>
                {doctorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3">
            <Form.Group>
              <Form.Label>Filter by Department</Form.Label>
              <Form.Select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                aria-label="Filter by department"
              >
                {departmentOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h5>Actions</h5>
              <div className="flex space-x-2">
                <Button variant="primary" onClick={handleNewAppointment}>
                  <FaPlus className="mr-1" /> New Appointment
                </Button>
                <Button variant="outline-secondary" onClick={handleExportAppointments}>
                  <FaFileExport className="mr-1" /> Export to CSV
                </Button>
                {selectedAppointments.length > 0 && (
                  <Form.Select
                    style={{ width: 'auto' }}
                    onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                    aria-label="Bulk update status"
                  >
                    <option value="">Bulk Update Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="appointment-card">
        <Card.Body>
          <h5 className="mb-3">Appointments for {selectedDate.toLocaleDateString()}</h5>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading appointments...</p>
          ) : filteredAppointments.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    {appointmentColumns.map((col, index) => (
                      <th key={index}>{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((row) => (
                    <tr key={row.id}>
                      {appointmentColumns.map((col, colIndex) => (
                        <td key={colIndex}>{col.cell ? col.cell(row) : row[col.accessor]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No appointments scheduled for the selected date.</p>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
      <Modal show={isNewAppointmentModalOpen} onHide={() => setIsNewAppointmentModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule New Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewAppointmentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select value={formData.patientId} onChange={handlePatientChange} required>
                <option value="">Select Patient</option>
                {patientOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select value={formData.doctorId} onChange={handleDoctorChange} required>
                <option value="">Select Doctor</option>
                {doctorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control value={formData.department} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                minDate={new Date()}
                className="form-control"
                dateFormat="MM/dd/yyyy"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time Slot</Form.Label>
              <Form.Select value={formData.time} name="time" onChange={handleInputChange} required>
                <option value="">Select Time</option>
                {timeSlotOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Select value={formData.duration} name="duration" onChange={handleInputChange} required>
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Type</Form.Label>
              <Form.Select value={formData.type} name="type" onChange={handleInputChange} required>
                <option value="">Select Type</option>
                {appointmentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes about the appointment"
              />
            </Form.Group>
            <Button variant="primary" type="submit">Schedule Appointment</Button>
            <Button variant="secondary" onClick={() => setIsNewAppointmentModalOpen(false)} className="ml-2">Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={isEditAppointmentModalOpen} onHide={() => setIsEditAppointmentModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditAppointmentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select value={formData.patientId} onChange={handlePatientChange} required>
                <option value="">Select Patient</option>
                {patientOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select value={formData.doctorId} onChange={handleDoctorChange} required>
                <option value="">Select Doctor</option>
                {doctorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control value={formData.department} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                minDate={new Date()}
                className="form-control"
                dateFormat="MM/dd/yyyy"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time Slot</Form.Label>
              <Form.Select value={formData.time} name="time" onChange={handleInputChange} required>
                <option value="">Select Time</option>
                {timeSlotOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Select value={formData.duration} name="duration" onChange={handleInputChange} required>
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Type</Form.Label>
              <Form.Select value={formData.type} name="type" onChange={handleInputChange} required>
                <option value="">Select Type</option>
                {appointmentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes about the appointment"
              />
            </Form.Group>
            <Button variant="primary" type="submit">Update Appointment</Button>
            <Button variant="secondary" onClick={() => setIsEditAppointmentModalOpen(false)} className="ml-2">Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={isApproveAppointmentModalOpen} onHide={() => setIsApproveAppointmentModalOpen(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Approve Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Approve appointment for {currentAppointment?.patientName}?</p>
          <p>
            <strong>Date:</strong> {currentAppointment?.date.toLocaleDateString()}<br />
            <strong>Time:</strong> {currentAppointment?.time}<br />
            <strong>Doctor:</strong> {currentAppointment?.doctorName}
          </p>
          <Button variant="success" onClick={handleApproveAppointmentConfirm}>Approve</Button>
          <Button variant="secondary" onClick={() => setIsApproveAppointmentModalOpen(false)} className="ml-2">Cancel</Button>
        </Modal.Body>
      </Modal>

      <Modal show={isDeleteAppointmentModalOpen} onHide={() => setIsDeleteAppointmentModalOpen(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Cancel Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel the appointment for {currentAppointment?.patientName}?</p>
          <p>
            <strong>Date:</strong> {currentAppointment?.date.toLocaleDateString()}<br />
            <strong>Time:</strong> {currentAppointment?.time}<br />
            <strong>Doctor:</strong> {currentAppointment?.doctorName}
          </p>
          <Button variant="danger" onClick={handleDeleteAppointmentConfirm}>Cancel Appointment</Button>
          <Button variant="secondary" onClick={() => setIsDeleteAppointmentModalOpen(false)} className="ml-2">Close</Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AppointmentScheduling;