import React from 'react';
import { Container } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';
import Card from './ui/Card';
import './patient-dashboard.css';

const PatientHelp = () => {
  return (
    <Container className="patient-dashboard">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaQuestionCircle className="mr-2" /> Help
      </h1>
      <Card title="Help & Support" className="help-card">
        <p>Contact support at <a href="mailto:support@nxtgenhospital.com">support@nxtgenhospital.com</a>.</p>
        <p>Phone: (123) 456-7890</p>
        <p>FAQ and documentation will be available soon.</p>
      </Card>
    </Container>
  );
};

export default PatientHelp;