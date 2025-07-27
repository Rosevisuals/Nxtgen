import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from '../../components/ui/DatePicker';

/**
 * PatientRegistration Component
 * 
 * Form for registering new patients.
 */
const PatientRegistration = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceGroupNumber: '',
    primaryCarePhysician: '',
  });
  
  // Gender options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ];
  
  // Blood type options
  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'Unknown', label: 'Unknown' },
  ];
  
  // Doctor options (in a real app, this would come from an API)
  const doctorOptions = [
    { value: 'Dr. John Smith', label: 'Dr. John Smith - Cardiology' },
    { value: 'Dr. Emily Johnson', label: 'Dr. Emily Johnson - Neurology' },
    { value: 'Dr. Michael Davis', label: 'Dr. Michael Davis - Pediatrics' },
    { value: 'Dr. Sarah Wilson', label: 'Dr. Sarah Wilson - Orthopedics' },
    { value: 'Dr. Robert Brown', label: 'Dr. Robert Brown - Dermatology' },
    { value: 'None', label: 'None' },
  ];
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle date of birth change
  const handleDateOfBirthChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
  };
  
  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return '';
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    console.log('Patient registration data:', formData);
    
    // Generate a patient ID (in a real app, this would come from the API)
    const patientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Show success message and navigate to the new patient's page
    alert(`Patient registered successfully! Patient ID: ${patientId}`);
    navigate(`/receptionist/patients/${patientId}`);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/receptionist/dashboard');
  };
  
  return (
    <div className="patient-registration">
      <h1>
        <FaUserPlus className="page-icon" />
        Patient Registration
      </h1>
      
      <Card className="registration-card">
        <form onSubmit={handleSubmit}>
          <h3>Personal Information</h3>
          <div className="form-row">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleDateOfBirthChange}
              maxDate={new Date()}
              required
            />
            
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="text"
                value={calculateAge(formData.dateOfBirth)}
                readOnly
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genderOptions}
              required
            />
          </div>
          
          <h3>Contact Information</h3>
          <div className="form-row">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={<FaEnvelope />}
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              icon={<FaPhone />}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              icon={<FaMapMarkerAlt />}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="State/Province"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Zip/Postal Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <h3>Emergency Contact</h3>
          <div className="form-row">
            <Input
              label="Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Relationship"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              required
              icon={<FaPhone />}
            />
          </div>
          
          <h3>Medical Information</h3>
          <div className="form-row">
            <Select
              label="Blood Type"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleInputChange}
              options={bloodTypeOptions}
              icon={<FaHeartbeat />}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              placeholder="List any allergies, separated by commas"
              multiline
              rows={2}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Chronic Conditions"
              name="chronicConditions"
              value={formData.chronicConditions}
              onChange={handleInputChange}
              placeholder="List any chronic conditions, separated by commas"
              multiline
              rows={2}
            />
          </div>
          
          <h3>Insurance Information</h3>
          <div className="form-row">
            <Input
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
            />
            
            <Input
              label="Policy Number"
              name="insurancePolicyNumber"
              value={formData.insurancePolicyNumber}
              onChange={handleInputChange}
              icon={<FaIdCard />}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Group Number"
              name="insuranceGroupNumber"
              value={formData.insuranceGroupNumber}
              onChange={handleInputChange}
            />
          </div>
          
          <h3>Primary Care</h3>
          <div className="form-row">
            <Select
              label="Primary Care Physician"
              name="primaryCarePhysician"
              value={formData.primaryCarePhysician}
              onChange={handleInputChange}
              options={doctorOptions}
            />
          </div>
          
          <div className="form-actions">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              Register Patient
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PatientRegistration;