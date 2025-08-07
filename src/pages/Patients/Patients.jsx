import React, { useState, useEffect } from 'react';

const demoPatients = [
  { id: 1, name: 'John Doe', age: 30, gender: 'Male', contact: '555-1234', lastVisit: '2023-05-15', status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 25, gender: 'Female', contact: '555-5678', lastVisit: '2023-06-20', status: 'Active' },
  { id: 3, name: 'Mike Brown', age: 40, gender: 'Male', contact: '555-8765', lastVisit: '2023-04-10', status: 'Inactive' },
  { id: 4, name: 'Sarah Johnson', age: 35, gender: 'Female', contact: '555-4321', lastVisit: '2023-07-05', status: 'Active' },
  { id: 5, name: 'David Wilson', age: 28, gender: 'Male', contact: '555-9876', lastVisit: '2023-03-18', status: 'Inactive' },
];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatients(demoPatients);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.contact.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewPatient = (patient) => {
    alert(`Viewing patient: ${patient.name}\nAge: ${patient.age}\nContact: ${patient.contact}\nStatus: ${patient.status}`);
  };

  const handleEditPatient = (patient) => {
    const newName = prompt('Edit patient name:', patient.name);
    if (newName && newName !== patient.name) {
      setPatients(prev => prev.map(p => 
        p.id === patient.id ? { ...p, name: newName } : p
      ));
      alert('Patient updated successfully!');
    }
  };

  const handleDeletePatient = (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      setPatients(prev => prev.filter(p => p.id !== patient.id));
      alert('Patient deleted successfully!');
    }
  };

  // Styles
  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  };

  const headerStyle = {
    color: '#2c3e50',
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e0e0e0'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const searchInputStyle = {
    flex: '1',
    minWidth: '250px',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    ':focus': {
      outline: 'none',
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
    }
  };

  const filterSelectStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    fontSize: '15px',
    minWidth: '180px',
    ':focus': {
      outline: 'none',
      borderColor: '#3f51b5'
    }
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
  };

  const thStyle = {
    backgroundColor: '#3f51b5',
    color: 'white',
    padding: '16px',
    textAlign: 'left',
    fontWeight: '500'
  };

  const tdStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: 'white'
  };

  const trHoverStyle = {
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    color: '#666'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '8px'
  };

  const statusBadgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: status === 'Active' ? '#4CAF50' : '#F44336',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    display: 'inline-block'
  });

  const genderIconStyle = (gender) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: gender === 'Male' ? '#e3f2fd' : '#fce4ec',
    color: gender === 'Male' ? '#1565c0' : '#c2185b',
    marginRight: '8px',
    fontSize: '12px',
    fontWeight: 'bold'
  });

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Patient Records</h2>
      
      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="Search patients by name or contact..."
          style={searchInputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      
      {loading ? (
        <div style={loadingStyle}>
          <div>Loading patient records...</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          {filteredPatients.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Patient</th>
                  <th style={thStyle}>Age</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>Last Visit</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id} style={trHoverStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '500' }}>{patient.name}</div>
                    </td>
                    <td style={tdStyle}>{patient.age}</td>
                    <td style={tdStyle}>
                      <span style={genderIconStyle(patient.gender)}>
                        {patient.gender.charAt(0)}
                      </span>
                      {patient.gender}
                    </td>
                    <td style={tdStyle}>{patient.contact}</td>
                    <td style={tdStyle}>{patient.lastVisit}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(patient.status)}>
                        {patient.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleViewPatient(patient)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#F44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={emptyStateStyle}>
              No patients found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}