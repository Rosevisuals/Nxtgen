import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wards = () => {
  // Dummy ward data
  const [wards] = useState([
    { id: 1, number: '101', type: 'ICU', capacity: 1, status: 'Occupied' },
    { id: 2, number: '102', type: 'General', capacity: 4, status: 'Available' },
    { id: 3, number: '103', type: 'Maternity', capacity: 2, status: 'Occupied' },
  ]);

  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>All Wards</h1>

        <Link 
          to="/wards/add" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.target.style.backgroundColor = '#2563eb'}
        >
          <FaPlus /> Add Ward
        </Link>
      </div>

      {/* Table */}
      <div style={{
        overflowX: 'auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <table style={{
          width: '100%',
          fontSize: '14px',
          textAlign: 'left',
          color: '#374151',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            textTransform: 'uppercase',
            fontSize: '12px'
          }}>
            <tr>
              <th style={{ padding: '16px 24px' }}>Ward No</th>
              <th style={{ padding: '16px 24px' }}>Type</th>
              <th style={{ padding: '16px 24px' }}>Capacity</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wards.map((ward, index) => (
              <tr
                key={ward.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: hoveredRow === index ? '#f9fafb' : 'white'
                }}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{ padding: '16px 24px' }}>{ward.number}</td>
                <td style={{ padding: '16px 24px' }}>{ward.type}</td>
                <td style={{ padding: '16px 24px' }}>{ward.capacity}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '9999px',
                    backgroundColor: ward.status === 'Available' ? '#dcfce7' : '#fee2e2',
                    color: ward.status === 'Available' ? '#166534' : '#991b1b'
                  }}>
                    {ward.status}
                  </span>
                </td>
                <td style={{ 
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    style={{
                      color: '#3b82f6',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.target.style.color = '#1d4ed8'}
                    onMouseLeave={e => e.target.style.color = '#3b82f6'}
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={{
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.target.style.color = '#dc2626'}
                    onMouseLeave={e => e.target.style.color = '#ef4444'}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {wards.length === 0 && (
              <tr>
                <td colSpan="5" style={{
                  textAlign: 'center',
                  padding: '24px',
                  color: '#6b7280'
                }}>No Wards found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wards;
