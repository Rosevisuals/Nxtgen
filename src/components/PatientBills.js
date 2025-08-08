import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFileInvoiceDollar, FaArrowLeft, FaPrint } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../utils/api';
import './centered-layout.css';

const PatientBills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');

  const [bills, setBills] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patient data
        const patientsData = await apiFetch('/patients');
        const patientData = patientsData?.find(p => p.patient_id.toString() === patientId);
        if (patientData) {
          setPatient({
            id: patientData.patient_id,
            name: patientData.full_Name
          });
        }

        // Fetch bills for this patient
        const billsData = await apiFetch('/billing');
        const patientBills = billsData?.filter(bill => bill.patient_id.toString() === patientId) || [];
        setBills(patientBills);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  const totalAmount = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const pendingBills = bills.filter(bill => bill.status === 'Pending');

  if (loading) {
    return (
      <div className="centered-container">
        <div className="centered-content">
          <p>Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="centered-content">
        <div className="page-header">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/ReceptionistDashboard')}
            style={{ marginRight: '1rem' }}
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="page-title">
            <FaFileInvoiceDollar /> Patient Bills
          </h1>
          <p className="page-subtitle">
            {patient ? `${patient.name} (ID: ${patient.id})` : `Patient ID: ${patientId}`}
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Bill Summary</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-value">{bills.length}</div>
                  <div className="stat-label">Total Services</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-value">{totalAmount.toLocaleString()} UGX</div>
                  <div className="stat-label">Total Amount</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-value">{pendingBills.length}</div>
                  <div className="stat-label">Pending Bills</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Service Bills</h2>
          </div>
          <div className="card-body">
            {bills.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr key={bill.bill_id}>
                        <td>{bill.service_name}</td>
                        <td>{new Date(bill.date_issued).toLocaleDateString()}</td>
                        <td>{bill.amount.toLocaleString()} UGX</td>
                        <td>
                          <span className={`badge badge-${bill.status === 'Paid' ? 'success' : 'warning'}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => toast.info('Print functionality coming soon')}
                          >
                            <FaPrint /> Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center" style={{ padding: '2rem' }}>
                <p>No bills found for this patient.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBills;