import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import { registerPatient } from '../services/receptionistService';
import './patient-register.css';

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
      const response = await registerPatient(formData);
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
    <div className="patient-register">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="page-title">
        <FaUserPlus className="page-icon" /> Register New Patient
      </h1>
      <Card className="register-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_Name">Full Name</label>
            <input
              type="text"
              id="full_Name"
              name="full_Name"
              value={formData.full_Name}
              onChange={handleChange}
              className={errors.full_Name ? 'error' : ''}
              placeholder="Enter patient's full name"
            />
            {errors.full_Name && <span className="error-text">{errors.full_Name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="DOB">Date of Birth</label>
            <input
              type="date"
              id="DOB"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              className={errors.DOB ? 'error' : ''}
            />
            {errors.DOB && <span className="error-text">{errors.DOB}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="Address">Address</label>
            <textarea
              id="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              className={errors.Address ? 'error' : ''}
              placeholder="Enter patient's address"
            />
            {errors.Address && <span className="error-text">{errors.Address}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="marital_status">Marital Status</label>
            <select
              id="marital_status"
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="blood_group">Blood Group (Optional)</label>
            <select
              id="blood_group"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
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
          <div className="form-group">
            <label htmlFor="emergency_contact">Emergency Contact</label>
            <input
              type="tel"
              id="emergency_contact"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              className={errors.emergency_contact ? 'error' : ''}
              placeholder="Emergency contact phone number"
            />
            {errors.emergency_contact && <span className="error-text">{errors.emergency_contact}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="BMI">BMI (Optional)</label>
            <input
              type="text"
              id="BMI"
              name="BMI"
              value={formData.BMI}
              onChange={handleChange}
              placeholder="e.g., 22.5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="NOTES">Notes (Optional)</label>
            <textarea
              id="NOTES"
              name="NOTES"
              value={formData.NOTES}
              onChange={handleChange}
              placeholder="Any additional notes about the patient"
            />
          </div>
          <div className="form-actions">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              aria-label="Register patient"
            >
              {isLoading ? 'Registering...' : 'Register Patient'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/ReceptionistDashboard')}
              disabled={isLoading}
              aria-label="Cancel registration"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PatientRegister;