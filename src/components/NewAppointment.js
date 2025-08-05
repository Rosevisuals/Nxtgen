import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import { apiFetch } from '../utils/api';
import './centered-layout.css';

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
      console.log('Creating appointment with data:', formData);
      const response = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      console.log('Appointment created:', response);
      toast.success('Appointment scheduled successfully!');
      setTimeout(() => {
        navigate('/ReceptionistDashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(`Failed to schedule appointment: ${error.message}`);
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
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <h1 className="page-title">
            <FaCalendarAlt /> Schedule New Appointment
          </h1>
          <p className="page-subtitle">Create a new appointment for a patient</p>
        </div>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="patient_id">Patient</label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  className={`form-select ${errors.patient_id ? 'error' : ''}`}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.full_Name} (ID: {patient.patient_id})
                    </option>
                  ))}
                </select>
                {errors.patient_id && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.patient_id}</span>}
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="department_id">Department</label>
                    <select
                      id="department_id"
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      className={`form-select ${errors.department_id ? 'error' : ''}`}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.department_id} value={dept.department_id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.department_id}</span>}
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="staff_id">Doctor</label>
                    <select
                      id="staff_id"
                      name="staff_id"
                      value={formData.staff_id}
                      onChange={handleChange}
                      className={`form-select ${errors.staff_id ? 'error' : ''}`}
                    >
                      <option value="">Select Doctor</option>
                      {staff.filter(s => formData.department_id ? s.department_id == formData.department_id : true).map(doctor => (
                        <option key={doctor.staff_id} value={doctor.staff_id}>
                          Dr. {doctor.full_Name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                    {errors.staff_id && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.staff_id}</span>}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="appointment_date">Date and Time</label>
                <input
                  type="datetime-local"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className={`form-input ${errors.appointment_date ? 'error' : ''}`}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.appointment_date && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.appointment_date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="notes">Reason for Appointment</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={`form-input ${errors.notes ? 'error' : ''}`}
                  placeholder="Describe the reason for this appointment"
                  rows="3"
                />
                {errors.notes && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.notes}</span>}
              </div>
              <div className="text-center mt-4">
                <div className="row">
                  <div className="col-6">
                    <button type="submit" className="btn btn-primary" aria-label="Schedule appointment">
                      Schedule Appointment
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      aria-label="Cancel scheduling"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;