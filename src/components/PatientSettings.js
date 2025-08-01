import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import './patient-dashboard.css';

const PatientSettings = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockUser = useMemo(() => ({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, Anytown, USA',
  }), []);

  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    // const token = localStorage.getItem('authToken');
    // fetch('/api/patient/profile', {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setUser(data);
    //     setIsLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to fetch profile.');
    //     setIsLoading(false);
    //     toast.error('Failed to load profile.');
    //   });
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 500);
  }, [mockUser]);

  const handleUpdateProfile = () => {
    // TODO: Implement API call to update profile
    toast.success('Profile update not implemented yet.');
  };

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading settings...</p>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container className="patient-dashboard not-found">
        <h1>Profile Not Found</h1>
        <p>{error || 'Unable to load profile.'}</p>
      </Container>
    );
  }

  return (
    <Container className="patient-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaCog className="mr-2" /> Settings
      </h1>
      <Card title="Profile Settings" className="settings-card">
        <Row>
          <Col md={6}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" defaultValue={user.name} disabled />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" defaultValue={user.email} disabled />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" className="form-control" defaultValue={user.phone} disabled />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="form-control" defaultValue={user.address} disabled />
            </div>
          </Col>
        </Row>
        <div className="settings-actions mt-4">
          <Button variant="primary" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default PatientSettings;