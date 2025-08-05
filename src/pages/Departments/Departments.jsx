import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AllDepartments = () => {
  // Updated dummy data with 'description' instead of 'location'
  const departments = [
    {
      id: 1,
      name: 'Emergency',
      description: 'Handles urgent and life-threatening medical conditions.',
      head: 'Dr. Charles Opio',
    },
    {
      id: 2,
      name: 'Maternity',
      description: 'Provides care for pregnant women and newborns.',
      head: 'Dr. Grace Nyeko',
    },
    {
      id: 3,
      name: 'Surgery',
      description: 'Performs surgical operations and post-op care.',
      head: 'Dr. Samuel Otim',
    },
  ];

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b'
        }}>All Departments</h1>
        <Link
          to="/departments/add"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s',
          }}
        >
          <FaPlus /> Add Department
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          textAlign: 'left',
          fontSize: '14px',
          color: '#334155'
        }}>
          <thead style={{
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            textTransform: 'uppercase',
            fontSize: '12px'
          }}>
            <tr>
              <th style={{ padding: '16px 24px' }}>Department Name</th>
              <th style={{ padding: '16px 24px' }}>Description</th>
              <th style={{ padding: '16px 24px' }}>Head of Department</th>
              <th style={{ padding: '16px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} style={{
                borderBottom: '1px solid #e2e8f0',
              }}>
                <td style={{ padding: '16px 24px', color: '#1e293b' }}>{dept.name}</td>
                <td style={{ padding: '16px 24px', color: '#64748b' }}>{dept.description}</td>
                <td style={{ padding: '16px 24px', color: '#1e293b' }}>{dept.head}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                      color: '#2563eb',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}>
                      <FaEdit />
                    </button>
                    <button style={{
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan="4" style={{
                  textAlign: 'center',
                  padding: '24px',
                  color: '#64748b'
                }}>
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDepartments;
