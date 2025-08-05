import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Table from './ui/Table';
import { getAllPatients } from '../services/receptionistService';
import './patient-search.css';
import './receptionist-responsive.css';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllPatients = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPatients();
        setAllPatients(data);
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setPatients(allPatients);
      return;
    }
    const filtered = allPatients.filter(patient =>
      patient.full_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id?.toString().includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPatients(filtered);
  };

  const patientColumns = [
    { header: 'Patient ID', accessor: 'patient_id' },
    { header: 'Name', accessor: 'full_Name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'Address' },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/receptionist/patients/${row.patient_id}`)}
          aria-label={`View patient ${row.full_Name}`}
        >
          View
        </Button>
      ),
    },
  ];

  const handleBack = () => navigate('/ReceptionistDashboard');

  if (isLoading) {
    return (
      <div className="patient-search loading">
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="patient-search">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-header">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          className="back-button"
        >
          <FaArrowLeft className="mr-1" /> Back to Dashboard
        </Button>
        <h1 className="page-title">
          <FaSearch className="page-icon" /> Find Patient
        </h1>
      </div>
      <Card className="search-card">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="searchTerm">Search by Name or ID</label>
            <div className="search-input">
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name or patient ID"
              />
              <Button type="submit" variant="primary" aria-label="Search patients">
                <FaSearch />
              </Button>
            </div>
          </div>
        </form>
      </Card>
      <Card title={`Search Results (${patients.length} patients found)`} className="results-card">
        <div className="table-responsive">
          {patients.length > 0 ? (
            <Table columns={patientColumns} data={patients} striped hoverable />
          ) : (
            <div className="no-results">
              <p>No patients found matching your search.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PatientSearch;