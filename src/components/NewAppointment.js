import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import { apiFetch } from '../utils/api';
import './new-appointment.css';
import './receptionist-responsive.css';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: '',
    staff_id: '',
    appointment_date: '',
    department_id: '',
    notes: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [departmentsData, staffData, patientsData] = await Promise.all([
          apiFetch('/departments'),
          apiFetch('/staff'),
          apiFetch('/patients')
        ]);
        setDepartments(departmentsData || []);
        setStaff(staffData || []);
        setPatients(patientsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
    if (!formData.staff_id) newErrors.staff_id = 'Doctor is required';
    if (!formData.appointment_date) newErrors.appointment_date = 'Date and time are required';
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.notes) newErrors.notes = 'Reason is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      toast.success('Appointment scheduled successfully!');
      setTimeout(() => {
        navigate('/ReceptionistDashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to schedule appointment');
    }
  };

  const handleCancel = () => {
    toast.info('Appointment scheduling cancelled');
    navigate('/ReceptionistDashboard');
  };

  if (isLoading) {
    return (
      <div className="new-appointment loading">
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="new-appointment container-fluid">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-header">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/ReceptionistDashboard')}
          className="back-button"
        >
          <FaArrowLeft className="mr-1" /> Back to Dashboard
        </Button>
        <h1 className="page-title">
          <FaCalendarAlt className="page-icon" /> Schedule New Appointment
        </h1>
      </div>
      <Card className="appointment-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patient_id">Patient</label>
            <select
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              className={errors.patient_id ? 'error' : ''}
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.full_Name} (ID: {patient.patient_id})
                </option>
              ))}
            </select>
            {errors.patient_id && <span className="error-text">{errors.patient_id}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="department_id">Department</label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className={errors.department_id ? 'error' : ''}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department_id && <span className="error-text">{errors.department_id}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="staff_id">Doctor</label>
            <select
              id="staff_id"
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
              className={errors.staff_id ? 'error' : ''}
            >
              <option value="">Select Doctor</option>
              {staff.filter(s => formData.department_id ? s.department_id == formData.department_id : true).map(doctor => (
                <option key={doctor.staff_id} value={doctor.staff_id}>
                  Dr. {doctor.full_Name} - {doctor.specialization}
                </option>
              ))}
            </select>
            {errors.staff_id && <span className="error-text">{errors.staff_id}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="appointment_date">Date and Time</label>
            <input
              type="datetime-local"
              id="appointment_date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              className={errors.appointment_date ? 'error' : ''}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.appointment_date && <span className="error-text">{errors.appointment_date}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="notes">Reason for Appointment</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={errors.notes ? 'error' : ''}
              placeholder="Describe the reason for this appointment"
            />
            {errors.notes && <span className="error-text">{errors.notes}</span>}
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" aria-label="Schedule appointment">
              Schedule Appointment
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              aria-label="Cancel scheduling"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewAppointment;