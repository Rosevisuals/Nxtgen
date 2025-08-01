import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FaHistory } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Badge from './ui/Badge';
import './patient-dashboard.css';

const HistoryItem = React.memo(({ record }) => (
  <div className="history-item" role="listitem">
    <div className="history-date">
      <div className="date-day">{new Date(record.date).toLocaleDateString()}</div>
    </div>
    <div className="history-details">
      <h4>{record.diagnosis}</h4>
      <div className="history-meta">
        <span>{record.type}</span>
        <span>{record.doctor}</span>
        <span>{record.department}</span>
      </div>
      <div className="history-notes">
        <strong>Notes:</strong> {record.notes}
      </div>
    </div>
  </div>
));

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockHistory = useMemo(() => [
    {
      id: 1,
      date: '2025-07-20',
      type: 'Check-up',
      doctor: 'Dr. John Smith',
      department: 'Cardiology',
      diagnosis: 'Hypertension',
      notes: 'Blood pressure remains elevated. Adjusting medication dosage.',
    },
    {
      id: 2,
      date: '2025-06-15',
      type: 'Follow-up',
      doctor: 'Dr. John Smith',
      department: 'Cardiology',
      diagnosis: 'Type 2 Diabetes',
      notes: 'Blood sugar levels improved. Continue with current medication.',
    },
  ], []);

  useEffect(() => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    // const token = localStorage.getItem('authToken');
    // fetch('/api/patient/history', {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setHistory(data);
    //     setIsLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to fetch medical history.');
    //     setIsLoading(false);
    //     toast.error('Failed to load medical history.');
    //   });
    setTimeout(() => {
      setHistory(mockHistory);
      setIsLoading(false);
    }, 500);
  }, [mockHistory]);

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading medical history...</p>
      </Container>
    );
  }

  if (error || !history.length) {
    return (
      <Container className="patient-dashboard not-found">
        <h1>No Medical History Found</h1>
        <p>{error || 'No medical history available.'}</p>
      </Container>
    );
  }

  return (
    <Container className="patient-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FaHistory className="mr-2" /> Medical History
      </h1>
      <Card title="Medical History" className="history-card">
        <div className="history-list" role="list">
          {history.map((record, index) => (
            <HistoryItem key={index} record={record} />
          ))}
        </div>
      </Card>
    </Container>
  );
};

export default PatientHistory;