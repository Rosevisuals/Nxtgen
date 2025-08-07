import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaHospital, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';
import './AppointmentRequests.css';
import { apiFetch } from '../utils/api';

/**
 * AppointmentRequest Component
 * 
 * Form for patients to request new appointments, selecting a department and providing notes.
 */
const AppointmentRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    department_id: '',
    notes: '',
    patient_id: '', // Will be set from localStorage
    status: 'Pending', // Default status per database constraint
  });

  // Set patient_id by fetching patient data based on user_id
  useEffect(() => {
    const fetchPatientId = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        try {
          // Fetch all patients and find the one with matching user_id
          const patientsData = await apiFetch('/patients');
          const currentPatient = patientsData?.find(patient => 
            patient.user_id == userId || patient.patient_id == userId
          );
          
          if (currentPatient) {
            setFormData(prev => ({ ...prev, patient_id: currentPatient.patient_id }));
            console.log('Found patient_id:', currentPatient.patient_id, 'for user_id:', userId);
          } else {
            console.warn('No patient found for user_id:', userId);
            // Fallback: use patient_id = 1 for testing
            setFormData(prev => ({ ...prev, patient_id: '1' }));
            toast.warning('Using default patient for testing');
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
          // Fallback: use patient_id = 1 for testing
          setFormData(prev => ({ ...prev, patient_id: '1' }));
          toast.warning('Using default patient due to error');
        }
      } else {
        console.warn('No user_id found in localStorage');
        toast.error('Please log in to request an appointment');
      }
    };
    
    fetchPatientId();
  }, []);

  // Mock departments based on database inserts
  const mockDepartments = [
    { department_id: 1, name: 'Cardiology' },
    { department_id: 2, name: 'Pediatrics' },
    { department_id: 3, name: 'Neurology' },
  ];

  const departmentOptions = departments.map(dept => ({
    value: dept.department_id,
    label: dept.name,
  }));


  // Fetch departments (mock for now, API-ready)
  useEffect(() => {
    setIsLoading(true);

    // TODO: Uncomment and configure for API integration
    /*
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    const API_KEY = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY || localStorage.getItem('authToken')}`,
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/departments`, { headers });
        if (!response.ok) throw new Error('Failed to fetch departments.');
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
    */

    // Mock data loading
    setTimeout(() => {
      setDepartments(mockDepartments);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.department_id || !formData.notes) {
      toast.error('Please select a department and provide notes.');
      return;
    }

    setIsSubmitting(true);

    // TODO: Replace with actual API call
  
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    // const API_KEY = process.env.REACT_APP_API_KEY;
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    // };

    if (!formData.patient_id) {
      toast.error('Patient ID not found. Please try logging in again.');
      setIsSubmitting(false);
      return;
    }
    
    console.log('Submitting appointment with patient_id:', formData.patient_id);
    
    const appointmentData = apiFetch(`/appointments`, {
      method: 'POST',
      body: JSON.stringify({
        patient_id: formData.patient_id,
        appointment_date: new Date().toISOString(),
        department_id: formData.department_id,
        status: formData.status,
        notes: formData.notes
        // Remove hardcoded staff_id - let backend assign or leave null
      })
    })
      .then((data) => {
        console.log(data);
        setIsSubmitting(false);
        toast.success('Appointment request submitted successfully!');
        setTimeout(navigate('/PatientAppointments'), 2000)
      })
      .catch(err => {
        setIsSubmitting(false);
        toast.error(err.message);
      });
  };

  const handleBack = () => navigate(-1);
  const handleCancel = () => {
    toast.info('Appointment request cancelled');
    navigate('/PatientDashboard');
  };
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/patient/appointments');
  };

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  if (isLoading) {
    return (
      <div className="appointment-request loading">
        <p>Loading appointment request form...</p>
      </div>
    );
  }

  return (
    <div className="appointment-request">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="request-header">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          onKeyDown={(e) => handleKeyDown(e, handleBack)}
          aria-label="Go back"
          className="back-button"
        >
          <FaArrowLeft className="mr-1" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaCalendarAlt className="mr-2" /> Request an Appointment
        </h1>
      </div>

      <Card className="appointment-request-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaHospital className="mr-2" /> Department
            </h3>
            <div className="form-row">
              <Select
                label="Department"
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                options={departmentOptions}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2" /> Notes
            </h3>
            <div className="form-row">
              <Input
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Provide any additional information for your appointment"
                multiline
                rows={4}
                required
              />
            </div>
          </div>

          <div className="form-actions mt-4 flex justify-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              onKeyDown={(e) => handleKeyDown(e, handleCancel)}
              disabled={isSubmitting}
              aria-label="Cancel appointment request"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              aria-label="Submit appointment request"
            >
              {isSubmitting ? 'Submitting...' : 'Request Appointment'}
            </Button>
          </div>
        </form>
      </Card>

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