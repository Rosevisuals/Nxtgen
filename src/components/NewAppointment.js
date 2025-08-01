import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import './new-appointment.css';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    department: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Patient ID is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // TODO: Submit to API
    alert('Appointment scheduled successfully');
    navigate('/receptionist/dashboard');
  };

  return (
    <div className="new-appointment">
      <h1 className="page-title">
        <FaCalendarAlt className="page-icon" /> Schedule New Appointment
      </h1>
      <Card className="appointment-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientId">Patient ID</label>
            <input
              type="text"
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className={errors.patientId ? 'error' : ''}
            />
            {errors.patientId && <span className="error-text">{errors.patientId}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="doctorId">Doctor</label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className={errors.doctorId ? 'error' : ''}
            >
              <option value="">Select Doctor</option>
              <option value="D1">Dr. John Smith</option>
              <option value="D2">Dr. Emily Johnson</option>
              <option value="D3">Dr. Michael Wilson</option>
            </select>
            {errors.doctorId && <span className="error-text">{errors.doctorId}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={errors.time ? 'error' : ''}
            />
            {errors.time && <span className="error-text">{errors.time}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'error' : ''}
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason for Appointment</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={errors.reason ? 'error' : ''}
            />
            {errors.reason && <span className="error-text">{errors.reason}</span>}
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" aria-label="Schedule appointment">
              Schedule
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/receptionist/dashboard')}
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