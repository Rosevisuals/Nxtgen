import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FaFileMedical } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import './patient-dashboard.css';

const MedicationItem = React.memo(({ medication }) => (
  <div className="medication-item" role="listitem">
    <div className="medication-icon">
      <FaFileMedical />
    </div>
    <div className="medication-details">
      <h4>{medication.name}</h4>
      <div className="medication-meta">
        <span>{medication.dosage}</span>
        <span>{medication.frequency}</span>
      </div>
      <div className="medication-prescribed">
        Prescribed by {medication.prescribedBy} on {new Date(medication.startDate).toLocaleDateString()}
      </div>
    </div>
  </div>
));

const PatientPrescriptions = () => {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockMedications = useMemo(() => [
    {
      name: 'Lisinopril',
      dosage: '20mg',
      frequency: 'Once daily',
      startDate: new Date('2025-07-20'),
      endDate: null,
      prescribedBy: 'Dr. John Smith',
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: new Date('2025-07-20'),
      endDate: null,
      prescribedBy: 'Dr. John Smith',
    },
    {
      name: 'Atorvastatin',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: new Date('2025-06-15'),
      endDate: null,
      prescribedBy: 'Dr. John Smith',
    },
  ], []);

  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    // const token = localStorage.getItem('authToken');
    // fetch('/api/patient/prescriptions', {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setMedications(data);
    //     setIsLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to fetch prescriptions.');
    //     setIsLoading(false);
    //     toast.error('Failed to load prescriptions.');
    //   });
    setTimeout(() => {
      setMedications(mockMedications);
      setIsLoading(false);
    }, 500);
  }, [mockMedications]);

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading prescriptions...</p>
      </Container>
    );
  }

  if (error || !medications.length) {
    return (
      <Container className="patient-dashboard not-found">
        <h1>No Prescriptions Found</h1>
        <p>{error || 'No prescriptions available.'}</p>
      </Container>
    );
  }

  return (
    <Container className="patient-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaFileMedical className="mr-2" /> Prescriptions
      </h1>
      <Card title="Current Prescriptions" className="medications-card">
        <div className="medications-list" role="list">
          {medications.map((medication, index) => (
            <MedicationItem key={index} medication={medication} />
          ))}
        </div>
      </Card>
    </Container>
  );
};

export default PatientPrescriptions;