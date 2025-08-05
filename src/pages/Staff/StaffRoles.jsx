import React, { useState, useEffect } from 'react';

const demoRoles = [
  { id: 1, role: 'Doctor', description: 'Responsible for patient care and treatment.' },
  { id: 2, role: 'Nurse', description: 'Assists doctors and cares for patients.' },
  { id: 3, role: 'Receptionist', description: 'Manages appointments and patient records.' },
  { id: 4, role: 'Lab Technician', description: 'Conducts lab tests and reports results.' },
  { id: 5, role: 'Pharmacist', description: 'Manages medication dispensing.' },
  { id: 6, role: 'Administrator', description: 'Handles hospital operations.' },
];

export default function StaffRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoles(demoRoles);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRoles = roles.filter(role => 
    role.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#2c3e50',
          margin: 0
        }}>Staff Roles</h2>
        
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px 10px 36px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              width: '250px'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#95a5a6'
          }}>🔍</span>
        </div>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: '#7f8c8d'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0,0,0,0.1)',
              borderLeftColor: '#3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Loading staff roles...</span>
          </div>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#7f8c8d'
        }}>
          No roles found matching your search.
        </div>
      ) : (
        <div style={{
          overflowX: 'auto',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8f9fa',
                color: '#7f8c8d',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #eee'
                }}>Role</th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #eee'
                }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>{role.role}</td>
                  <td style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    color: '#7f8c8d'
                  }}>{role.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
