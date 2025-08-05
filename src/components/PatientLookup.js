import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserInjured, FaCalendarAlt, FaFileMedical, FaVial, FaPrescriptionBottleAlt } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Table from './ui/Table';
import Badge from './ui/Badge';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { toast } from 'react-toastify';

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
  const [recentPatients, setRecentPatients] = useState([]);
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
        setRecentPatients(formattedPatients.slice(0, 5));
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);
  
  // Table columns for patients
  const patientColumns = [
    { 
      header: 'Patient ID', 
      accessor: 'id',
    },
    { 
      header: 'Name', 
      accessor: 'name',
      cell: (row) => (
        <div className="patient-name">
          <FaUserInjured className="patient-icon" />
          <span>{row.name}</span>
        </div>
      ),
    },
    { header: 'Age', accessor: 'age' },
    { header: 'Gender', accessor: 'gender' },
    { 
      header: 'Last Visit', 
      accessor: 'lastVisit',
      cell: (row) => (
        <div className="last-visit">
          <FaCalendarAlt className="calendar-icon" />
          <span>{row.lastVisit}</span>
        </div>
      ),
    },
    { 
      header: 'Condition', 
      accessor: 'condition',
      cell: (row) => (
        <Badge 
          variant="primary"
          pill
        >
          {row.condition}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleViewPatient(row)}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNewConsultation(row)}
          >
            Consult
          </Button>
        </div>
      ),
    },
  ];
  
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
    // Add to recent patients if not already there
    if (!recentPatients.some(p => p.id === patient.id)) {
      setRecentPatients([patient, ...recentPatients].slice(0, 5));
    }
    
    navigate(`/doctor/patients/${patient.id}`);
  };
  
  // Handle new consultation
  const handleNewConsultation = (patient) => {
    navigate(`/doctor/consultations/new?patientId=${patient.id}`);
  };
  
  return (
    <div className="patient-lookup">
      <h1>Patient Lookup</h1>
      
      {/* Search Form */}
      <Card className="search-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <Input
              placeholder="Search by patient ID, name, or condition..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSearching}
            >
              <FaSearch /> Search
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card title="Search Results" className="results-card">
          <Table
            columns={patientColumns}
            data={searchResults}
            striped
            hoverable
          />
        </Card>
      )}
      
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <Card className="no-results-card">
          <div className="no-results">
            <p>No patients found matching "{searchQuery}".</p>
          </div>
        </Card>
      )}
      
      {/* Recent Patients */}
      <Card title="Recent Patients" className="recent-patients-card">
        {recentPatients.length > 0 ? (
          <Table
            columns={patientColumns}
            data={recentPatients}
            striped
            hoverable
          />
        ) : (
          <div className="no-recent-patients">
            <p>No recent patients viewed.</p>
          </div>
        )}
      </Card>
      
      {/* Quick Actions */}
      <Card title="Quick Actions" className="quick-actions-card">
        <div className="quick-actions">
          <Button 
            variant="primary" 
            onClick={() => navigate('/doctor/consultations/new')}
          >
            <FaFileMedical /> New Consultation
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/doctor/prescriptions/new')}
          >
            <FaPrescriptionBottleAlt /> New Prescription
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/doctor/lab-requests/new')}
          >
            <FaVial /> New Lab Request
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PatientLookup;