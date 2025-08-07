import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClock, FaSearch, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../utils/api';
import './centered-layout.css';
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
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Checked In', label: 'Checked In' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const appointmentsData = await apiFetch('/appointments');
        setAppointments(appointmentsData || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
        setAppointments(mockAppointments);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [mockAppointments]);

  // Filter appointments
  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      const selected = new Date(selectedDate);
      const dateMatches =
        appointmentDate.getDate() === selected.getDate() &&
        appointmentDate.getMonth() === selected.getMonth() &&
        appointmentDate.getFullYear() === selected.getFullYear();

      const query = searchQuery.toLowerCase();
      const searchMatches = query === '' ||
        appointment.patient_name?.toLowerCase().includes(query) ||
        appointment.doctor_name?.toLowerCase().includes(query) ||
        appointment.department_name?.toLowerCase().includes(query) ||
        appointment.notes?.toLowerCase().includes(query);

      const doctorMatches = filterDoctor === '' || appointment.staff_id === filterDoctor;
      const departmentMatches = filterDepartment === '' || appointment.department_name === filterDepartment;

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
    try {
      await apiFetch(`/appointments/${currentAppointment.appointment_id}/approve`, {
        method: 'PUT'
      });
      const appointmentsData = await apiFetch('/appointments');
      setAppointments(appointmentsData || []);
      toast.success('Appointment approved successfully!');
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Failed to approve appointment');
    }
    setIsApproveAppointmentModalOpen(false);
  };

  // Handle delete appointment
  const handleDeleteAppointment = (appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteAppointmentModalOpen(true);
  };

  const handleDeleteAppointmentConfirm = async () => {
    try {
      await apiFetch(`/appointments/${currentAppointment.appointment_id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by doctor' })
      });
      const appointmentsData = await apiFetch('/appointments');
      setAppointments(appointmentsData || []);
      toast.success('Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
    setIsDeleteAppointmentModalOpen(false);
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



  // Handle view patient
  const handleViewPatient = (appointment) => {
    navigate(`/PatientDetail?id=${appointment.patient_id}`);
  };

  return (
    <div className="centered-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="centered-content">
        <div className="page-header">
          <h1 className="page-title">
            <FaCalendarAlt /> Appointment Scheduling
          </h1>
          <p className="page-subtitle">Manage and schedule patient appointments</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Search & Filter</h2>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Search Appointments</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by patient, doctor, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Appointments for {selectedDate.toLocaleDateString()} ({filteredAppointments.length})</h2>
          </div>
          <div className="card-body">
            {isLoading ? (
              <p className="text-center">Loading appointments...</p>
            ) : filteredAppointments.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment, index) => (
                      <tr key={index}>
                        <td>
                          <div className="appointment-time">
                            <FaClock className="mr-2" />
                            {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td>
                          <div className="patient-info">
                            <span className="patient-name">{appointment.patient_name}</span>
                            <span className="patient-id">ID: {appointment.patient_id}</span>
                          </div>
                        </td>
                        <td>
                          <div className="doctor-info">
                            <FaUserMd className="mr-2" />
                            {appointment.doctor_name}
                          </div>
                        </td>
                        <td>{appointment.department_name}</td>
                        <td>
                          <span className={`badge badge-${appointment.status === 'Pending' ? 'warning' : appointment.status === 'Approved' ? 'success' : 'primary'}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>{appointment.notes}</td>
                        <td>
                          <div className="table-actions">
                            {appointment.status === 'Pending' && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleApproveAppointment(appointment)}
                                style={{marginRight: '0.5rem'}}
                              >
                                <FaCheck /> Approve
                              </button>
                            )}
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleEditAppointment(appointment)}
                              style={{marginRight: '0.5rem'}}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteAppointment(appointment)}
                            >
                              <FaTrash /> Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">No appointments scheduled for the selected date.</p>
            )}
          </div>
        </div>
      </div>
    </div>


  );
};

export default AppointmentScheduling;