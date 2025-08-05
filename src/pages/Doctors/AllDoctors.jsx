import React, { useEffect, useState } from 'react';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctors([
        { id: 1, name: 'Dr. Alice Johnson', specialty: 'Cardiology', availability: 'Mon, Wed, Fri' },
        { id: 2, name: 'Dr. Robert Smith', specialty: 'Neurology', availability: 'Tue, Thu' },
        { id: 3, name: 'Dr. Maria Garcia', specialty: 'Pediatrics', availability: 'Mon-Fri' },
        { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics', availability: 'Wed, Fri' }
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles
  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1000px',
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

  const searchInputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    ':focus': {
      outline: 'none',
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
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

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Our Medical Team</h2>
      
      <input
        type="text"
        placeholder="Search doctors by name or specialty..."
        style={searchInputStyle}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {loading ? (
        <div style={loadingStyle}>
          <div>Loading doctors...</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          {filteredDoctors.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Doctor Name</th>
                  <th style={thStyle}>Specialty</th>
                  <th style={thStyle}>Availability</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doctor => (
                  <tr key={doctor.id} style={trHoverStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '500' }}>{doctor.name}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ 
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {doctor.specialty}
                      </span>
                    </td>
                    <td style={tdStyle}>{doctor.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={emptyStateStyle}>
              No doctors found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}