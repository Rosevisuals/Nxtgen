import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserInjured } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './centered-layout.css';

/**
 * PatientLookup Component
 * 
 * Allows doctors to search for patients and view their basic information.
 */
const PatientLookup = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [allPatients, setAllPatients] = useState([]);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await apiFetch('/patients');
        const formattedPatients = (patientsData || []).map(patient => ({
          id: patient.patient_id,
          name: patient.full_Name,
          age: patient.DOB ? new Date().getFullYear() - new Date(patient.DOB).getFullYear() : 0,
          gender: patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other',
          phone: patient.phone,
          lastVisit: new Date().toISOString().split('T')[0],
          condition: 'General',
        }));
        setAllPatients(formattedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);
  

  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Filter patients based on search query
    const results = allPatients.filter(patient => {
      const query = searchQuery.toLowerCase();
      return (
        patient.id.toString().toLowerCase().includes(query) ||
        patient.name.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query)
      );
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  // Handle view patient
  const handleViewPatient = (patient) => {
    navigate(`/PatientDetail?id=${patient.id}`);
  };
  
  // Handle new consultation
  const handleNewConsultation = (patient) => {
    navigate(`/ConsultationForm?patientId=${patient.id}`);
  };
  
  return (
    <div className="centered-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="centered-content">
        <div className="page-header">
          <h1 className="page-title">
            <FaSearch /> Patient Lookup
          </h1>
          <p className="page-subtitle">Search and manage patient records</p>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Search Patients</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by patient ID, name, or condition..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSearching}
              >
                <FaSearch /> {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Search Results ({searchResults.length})</h2>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((patient, index) => (
                      <tr key={index}>
                        <td>{patient.id}</td>
                        <td>
                          <div className="patient-info">
                            <FaUserInjured className="mr-2" />
                            {patient.name}
                          </div>
                        </td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.phone}</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleViewPatient(patient)}
                            style={{marginRight: '0.5rem'}}
                          >
                            View
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleNewConsultation(patient)}
                          >
                            Consult
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="card">
            <div className="card-body text-center">
              <p>No patients found matching "{searchQuery}".</p>
            </div>
          </div>
        )}
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Patients ({allPatients.length})</h2>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPatients.slice(0, 10).map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.id}</td>
                      <td>
                        <div className="patient-info">
                          <FaUserInjured className="mr-2" />
                          {patient.name}
                        </div>
                      </td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone}</td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewPatient(patient)}
                          style={{marginRight: '0.5rem'}}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleNewConsultation(patient)}
                        >
                          Consult
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLookup;