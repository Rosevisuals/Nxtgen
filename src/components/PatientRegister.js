import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { registerPatient } from '../services/receptionistService';
import './centered-layout.css';

const PatientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_Name: '',
    email: '',
    phone: '',
    gender: '',
    DOB: '',
    marital_status: 'Single',
    Address: '',
    blood_group: '',
    BMI: '',
    emergency_contact: '',
    NOTES: '',
    status: "inactive"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_Name) newErrors.full_Name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.DOB) newErrors.DOB = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.Address) newErrors.Address = 'Address is required';
    if (!formData.emergency_contact) newErrors.emergency_contact = 'Emergency contact is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await registerPatient(formData);
      toast.success('Patient registered successfully! Password setup email sent.');
      navigate('/ReceptionistDashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <div className="header-actions">
            <button
              onClick={() => navigate('/ReceptionistDashboard')}
              aria-label="Go back to dashboard"
              className="btn btn-outline"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
          </div>
          <h1 className="page-title">
            <FaUserPlus /> Register New Patient
          </h1>
          <p className="page-subtitle">Enter patient information to create a new account</p>
        </div>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="full_Name">Full Name</label>
                <input
                  type="text"
                  id="full_Name"
                  name="full_Name"
                  value={formData.full_Name}
                  onChange={handleChange}
                  className={`form-input ${errors.full_Name ? 'error' : ''}`}
                  placeholder="Enter patient's full name"
                />
                {errors.full_Name && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.full_Name}</span>}
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.email}</span>}
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="DOB">Date of Birth</label>
                    <input
                      type="date"
                      id="DOB"
                      name="DOB"
                      value={formData.DOB}
                      onChange={handleChange}
                      className={`form-input ${errors.DOB ? 'error' : ''}`}
                    />
                    {errors.DOB && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.DOB}</span>}
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`form-select ${errors.gender ? 'error' : ''}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                    {errors.gender && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.gender}</span>}
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="marital_status">Marital Status</label>
                    <select
                      id="marital_status"
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="Address">Address</label>
                <textarea
                  id="Address"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  className={`form-input ${errors.Address ? 'error' : ''}`}
                  placeholder="Enter patient's address"
                  rows="3"
                />
                {errors.Address && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.Address}</span>}
              </div>
              <div className="row">
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="blood_group">Blood Group (Optional)</label>
                    <select
                      id="blood_group"
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="emergency_contact">Emergency Contact</label>
                    <input
                      type="tel"
                      id="emergency_contact"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className={`form-input ${errors.emergency_contact ? 'error' : ''}`}
                      placeholder="Emergency contact phone number"
                    />
                    {errors.emergency_contact && <span style={{color: '#ef4444', fontSize: '0.875rem'}}>{errors.emergency_contact}</span>}
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="BMI">BMI (Optional)</label>
                    <input
                      type="text"
                      id="BMI"
                      name="BMI"
                      value={formData.BMI}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 22.5"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="NOTES">Notes (Optional)</label>
                <textarea
                  id="NOTES"
                  name="NOTES"
                  value={formData.NOTES}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Any additional notes about the patient"
                  rows="3"
                />
              </div>
              <div className="text-center mt-4">
                <div className="row">
                  <div className="col-6">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                      aria-label="Register patient"
                    >
                      {isLoading ? 'Registering...' : 'Register Patient'}
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/ReceptionistDashboard')}
                      disabled={isLoading}
                      aria-label="Cancel registration"
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

export default PatientRegister;