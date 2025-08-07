import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAllPatients } from '../services/receptionistService';
import './centered-layout.css';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get patientId from URL params if provided
  const urlParams = new URLSearchParams(window.location.search);
  const patientIdFromUrl = urlParams.get('patientId');

  useEffect(() => {
    const fetchAllPatients = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPatients();
        const patientsArray = Array.isArray(data) ? data : [];
        setAllPatients(patientsArray);
        
        // If patientId is provided in URL, filter to show that patient
        if (patientIdFromUrl) {
          const filteredPatients = patientsArray.filter(patient => 
            patient.patient_id.toString() === patientIdFromUrl
          );
          setPatients(filteredPatients);
          setSearchTerm(`ID: ${patientIdFromUrl}`);
        } else {
          setPatients(patientsArray);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPatients();
  }, [patientIdFromUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setPatients(allPatients);
      return;
    }
    const filtered = (allPatients || []).filter(patient =>
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
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/receptionist/patients/${row.patient_id}`)}
          aria-label={`View patient ${row.full_Name}`}
        >
          View
        </button>
      ),
    },
  ];



  if (isLoading) {
    return (
      <div className="patient-search loading">
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <div className="header-actions">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back to dashboard"
              className="btn btn-outline"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
          </div>
          <h1 className="page-title">
            <FaSearch /> Find Patient
          </h1>
          <p className="page-subtitle">Search for patients by name, ID, or email</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Patient Search</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="form-group">
                <label className="form-label" htmlFor="searchTerm">Search by Name, ID, or Email</label>
                <div className="row">
                  <div className="col-8">
                    <input
                      type="text"
                      id="searchTerm"
                      className="form-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter name, patient ID, or email"
                    />
                  </div>
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary" aria-label="Search patients">
                      <FaSearch /> Search
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Search Results ({patients.length} patients found)</h2>
          </div>
          <div className="card-body">
            {patients.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      {patientColumns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((row, index) => (
                      <tr key={index}>
                        {patientColumns.map((col, colIndex) => (
                          <td key={colIndex}>
                            {col.cell ? col.cell(row) : row[col.accessor]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center" style={{padding: '2rem', color: '#64748b'}}>
                <p>No patients found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSearch;