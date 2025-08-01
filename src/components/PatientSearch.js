import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import Table from './ui/Table';
import './patient-search.css';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([
    { id: 'P-10025', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: 'P-10032', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '234-567-8901' },
    { id: 'P-10018', name: 'Robert Johnson', email: 'robert.j@example.com', phone: '345-678-9012' },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement API search
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm)
    );
    setPatients(filtered);
  };

  const patientColumns = [
    { header: 'Patient ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/receptionist/patients/${row.id}`)}
          aria-label={`View patient ${row.name}`}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="patient-search">
      <h1 className="page-title">
        <FaSearch className="page-icon" /> Find Patient
      </h1>
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
      <Card title="Search Results" className="results-card">
        {patients.length > 0 ? (
          <Table columns={patientColumns} data={patients} striped hoverable />
        ) : (
          <div className="no-results">
            <p>No patients found.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientSearch;