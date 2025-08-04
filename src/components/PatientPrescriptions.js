import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaFileMedical, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { getPatientByUserId, getPatientPrescriptions } from '../services/patientService';
import './patient-dashboard.css';
import './patient-responsive.css';

const MedicationItem = React.memo(({ medication }) => (
  <div className="medication-item" role="listitem">
    <div className="medication-icon">
      <FaFileMedical />
    </div>
    <div className="medication-details">
      <h4>{medication.Medication || medication.medicine_name}</h4>
      <div className="medication-meta">
        <span>{medication.dosage}</span>
        <span>{medication.notes || 'As prescribed'}</span>
      </div>
      <div className="medication-prescribed">
        Prescribed by {medication.doctor_name || 'Doctor'} on {new Date(medication.date_issued).toLocaleDateString()}
      </div>
    </div>
  </div>
));

const PatientPrescriptions = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('Please login to view prescriptions');
        }

        // Get patient data first
        const patientData = await getPatientByUserId(userId);
        if (!patientData) {
          throw new Error('Patient data not found');
        }

        setPatientName(patientData.full_Name || 'Patient');

        // Get prescriptions
        const prescriptionsData = await getPatientPrescriptions(patientData.patient_id);
        setMedications(prescriptionsData || []);

      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (isLoading) {
    return (
      <Container className="patient-dashboard loading">
        <p>Loading prescriptions...</p>
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
          <FaFileMedical className="mr-2" /> {patientName}'s Prescriptions
        </h1>
      </div>

      {error ? (
        <Card className="error-card">
          <div className="error-message">
            <h3>Error Loading Prescriptions</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      ) : (
        <Card title="Current Prescriptions" className="medications-card">
          {medications.length > 0 ? (
            <div className="medications-list" role="list">
              {medications.map((medication) => (
                <MedicationItem key={medication.prescription_id} medication={medication} />
              ))}
            </div>
          ) : (
            <div className="no-medications">
              <FaFileMedical size={48} className="text-gray-400 mb-3" />
              <h3>No Prescriptions Found</h3>
              <p>You don't have any active prescriptions.</p>
            </div>
          )}
        </Card>
      )}
    </Container>
  );
};

export default PatientPrescriptions;