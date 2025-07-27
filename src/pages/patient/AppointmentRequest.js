import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaHospital, FaInfoCircle } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from '../../components/ui/DatePicker';
import Modal from '../../components/ui/Modal';

/**
 * AppointmentRequest Component
 * 
 * Form for patients to request new appointments.
 */
const AppointmentRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    department: '',
    doctorId: '',
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    appointmentTime: '',
    appointmentType: '',
    reason: '',
    additionalNotes: '',
  });
  
  // Mock departments data (in a real app, this would come from an API)
  const mockDepartments = React.useMemo(() => [
    { id: 'D-1', name: 'Cardiology' },
    { id: 'D-2', name: 'Neurology' },
    { id: 'D-3', name: 'Pediatrics' },
    { id: 'D-4', name: 'Orthopedics' },
    { id: 'D-5', name: 'Dermatology' },
    { id: 'D-6', name: 'Ophthalmology' },
    { id: 'D-7', name: 'ENT' },
    { id: 'D-8', name: 'Gynecology' },
    { id: 'D-9', name: 'Urology' },
    { id: 'D-10', name: 'Psychiatry' },
  ], []);
  
  // Mock doctors data (in a real app, this would come from an API)
  const mockDoctors = React.useMemo(() => [
    { id: 'DR-1001', name: 'Dr. John Smith', department: 'Cardiology', availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'DR-1002', name: 'Dr. Emily Johnson', department: 'Neurology', availability: ['Tuesday', 'Thursday'] },
    { id: 'DR-1003', name: 'Dr. Michael Davis', department: 'Pediatrics', availability: ['Monday', 'Tuesday', 'Wednesday'] },
    { id: 'DR-1004', name: 'Dr. Sarah Wilson', department: 'Orthopedics', availability: ['Thursday', 'Friday'] },
    { id: 'DR-1005', name: 'Dr. Robert Brown', department: 'Dermatology', availability: ['Monday', 'Friday'] },
    { id: 'DR-1006', name: 'Dr. Jennifer Lee', department: 'Ophthalmology', availability: ['Tuesday', 'Wednesday', 'Thursday'] },
    { id: 'DR-1007', name: 'Dr. William Taylor', department: 'ENT', availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'DR-1008', name: 'Dr. Elizabeth Clark', department: 'Gynecology', availability: ['Tuesday', 'Thursday'] },
    { id: 'DR-1009', name: 'Dr. James Anderson', department: 'Urology', availability: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'DR-1010', name: 'Dr. Patricia Martinez', department: 'Psychiatry', availability: ['Tuesday', 'Thursday'] },
  ], []);
  
  // Appointment type options
  const appointmentTypeOptions = [
    { value: 'New Patient', label: 'New Patient' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Check-up', label: 'Check-up' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Procedure', label: 'Procedure' },
    { value: 'Emergency', label: 'Emergency' },
  ];
  
  // Department options
  const departmentOptions = departments.map(dept => ({
    value: dept.name,
    label: dept.name,
  }));
  
  // Doctor options
  const doctorOptions = filteredDoctors.map(doctor => ({
    value: doctor.id,
    label: doctor.name,
  }));
  
  // Time slot options (in a real app, this would be generated based on doctor's availability)
  const generateTimeSlots = (date, doctorId) => {
    // Get the day of the week
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Find the selected doctor
    const selectedDoctor = doctors.find(doctor => doctor.id === doctorId);
    
    // Check if the doctor is available on the selected day
    if (!selectedDoctor || !selectedDoctor.availability.includes(dayOfWeek)) {
      return [];
    }
    
    // Generate time slots (9 AM to 5 PM, 30-minute intervals)
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const hourStr = hour > 12 ? (hour - 12) : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      
      slots.push({ value: `${hourStr}:00 ${amPm}`, label: `${hourStr}:00 ${amPm}` });
      slots.push({ value: `${hourStr}:30 ${amPm}`, label: `${hourStr}:30 ${amPm}` });
    }
    
    return slots;
  }, [doctors]);
  
  // Fetch departments and doctors data
  useEffect(() => {
    // Simulate API call with setTimeout
    setIsLoading(true);
    setTimeout(() => {
      setDepartments(mockDepartments);
      setDoctors(mockDoctors);
      setIsLoading(false);
    }, 500);
  }, [mockDepartments, mockDoctors]);
  
  // Filter doctors based on selected department
  useEffect(() => {
    if (formData.department) {
      const filtered = doctors.filter(doctor => doctor.department === formData.department);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.department, doctors]);
  
  // Generate available time slots based on selected date and doctor
  useEffect(() => {
    if (formData.appointmentDate && formData.doctorId) {
      const slots = generateTimeSlots(formData.appointmentDate, formData.doctorId);
      setAvailableTimeSlots(slots);
      
      // Clear selected time if it's no longer available
      if (formData.appointmentTime && !slots.some(slot => slot.value === formData.appointmentTime)) {
        setFormData(prev => ({ ...prev, appointmentTime: '' }));
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.appointmentDate, formData.doctorId, formData.appointmentTime, generateTimeSlots]);
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      appointmentDate: date,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.department || !formData.doctorId || !formData.appointmentDate || 
        !formData.appointmentTime || !formData.appointmentType || !formData.reason) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // In a real app, this would send the data to an API
    setIsSubmitting(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log('Appointment request data:', formData);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 1000);
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/patient/dashboard');
  };
  
  // Handle success modal close
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/patient/appointments');
  };
  
  // If loading, show loading message
  if (isLoading) {
    return (
      <div className="appointment-request loading">
        <p>Loading appointment request form...</p>
      </div>
    );
  }
  
  return (
    <div className="appointment-request">
      <h1>
        <FaCalendarAlt className="page-icon" />
        Request an Appointment
      </h1>
      
      <Card className="appointment-request-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>
              <FaHospital className="section-icon" />
              Department & Doctor
            </h3>
            
            <div className="form-row">
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                options={departmentOptions}
                required
              />
            </div>
            
            <div className="form-row">
              <Select
                label="Doctor"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                options={doctorOptions}
                disabled={!formData.department}
                required
              />
              
              {formData.department && filteredDoctors.length === 0 && (
                <div className="form-helper-text">
                  <FaInfoCircle /> No doctors available in this department.
                </div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h3>
              <FaCalendarAlt className="section-icon" />
              Appointment Details
            </h3>
            
            <div className="form-row">
              <DatePicker
                label="Preferred Date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleDateChange}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                required
              />
            </div>
            
            <div className="form-row">
              <Select
                label="Preferred Time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                options={availableTimeSlots}
                disabled={!formData.doctorId || !formData.appointmentDate}
                required
              />
              
              {formData.doctorId && formData.appointmentDate && availableTimeSlots.length === 0 && (
                <div className="form-helper-text">
                  <FaInfoCircle /> The selected doctor is not available on this date. Please choose another date.
                </div>
              )}
            </div>
            
            <div className="form-row">
              <Select
                label="Appointment Type"
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleInputChange}
                options={appointmentTypeOptions}
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>
              <FaInfoCircle className="section-icon" />
              Reason & Notes
            </h3>
            
            <div className="form-row">
              <Input
                label="Reason for Visit"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Briefly describe the reason for your appointment"
                required
              />
            </div>
            
            <div className="form-row">
              <Input
                label="Additional Notes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to provide"
                multiline
                rows={3}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request Appointment'}
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Appointment Requested"
        size="sm"
      >
        <div className="success-modal-content">
          <p>Your appointment request has been submitted successfully!</p>
          <p>We will review your request and confirm your appointment soon.</p>
          <p>You can view the status of your appointment in the "My Appointments" section.</p>
        </div>
        
        <Modal.Footer
          onConfirm={handleSuccessModalClose}
          confirmText="View My Appointments"
        />
      </Modal>
    </div>
  );
};

export default AppointmentRequest;