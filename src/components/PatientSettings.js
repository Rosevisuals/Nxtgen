import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCog, FaArrowLeft, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { getPatientByUserId, updatePatient } from '../services/patientService';
import './patient-dashboard.css';
import './patient-responsive.css';

const PatientSettings = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('Please login to view settings');
        }

        const patientData = await getPatientByUserId(userId);
        if (!patientData) {
          throw new Error('Patient data not found');
        }

        setPatient(patientData);
        setFormData({
          full_Name: patientData.full_Name || '',
          email: patientData.email || '',
          phone: patientData.phone || '',
          Address: patientData.Address || '',
          blood_group: patientData.blood_group || '',
          BMI: patientData.BMI || '',
          emergency_contact: patientData.emergency_contact || ''
        });

      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      await updatePatient(patient.patient_id, formData);
      setPatient(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      full_Name: patient.full_Name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      Address: patient.Address || '',
      blood_group: patient.blood_group || '',
      BMI: patient.BMI || '',
      emergency_contact: patient.emergency_contact || ''
    });
    setIsEditing(false);
    toast.info('Changes cancelled');
  };

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading settings...</p>
      </Container>
    );
  }

  return (
    <Container className="patient-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-header">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/PatientDashboard')}
          className="back-button"
        >
          <FaArrowLeft className="mr-1" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaCog className="mr-2" /> {patient?.full_Name}'s Settings
        </h1>
      </div>

      {error ? (
        <Card className="error-card">
          <div className="error-message">
            <h3>Error Loading Settings</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      ) : (
        <Card title="Profile Settings" className="settings-card">
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="full_Name"
                  className="form-control" 
                  value={formData.full_Name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-control" 
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  name="phone"
                  className="form-control" 
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  name="Address"
                  className="form-control" 
                  value={formData.Address || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label>Blood Group</label>
                <select 
                  name="blood_group"
                  className="form-control" 
                  value={formData.blood_group || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
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
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input 
                  type="text" 
                  name="emergency_contact"
                  className="form-control" 
                  value={formData.emergency_contact || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </Col>
          </Row>
          <div className="settings-actions mt-4">
            {!isEditing ? (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                <FaUser className="mr-1" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="success" onClick={handleUpdateProfile} className="mr-2">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
    </Container>
  );
};

export default PatientSettings;