import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AllStaff = () => {
  const staffList = [
    { id: 1, name: 'Alice Johnson', specialisation: 'Nurse', department: 'Emergency', contact: '0701234567', status: 'Active' },
    { id: 2, name: 'Dr. Mark Lee', specialisation: 'Surgeon', department: 'Surgery', contact: '0707654321', status: 'Inactive' },
    { id: 3, name: 'Samuel Kim', specialisation: 'Receptionist', department: 'Front Desk', contact: '0709988776', status: 'Active' },
  ];

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>All Staff</h1>
        <Link
          to="/staff/add"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#16a34a',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <FaPlus /> Add Staff
        </Link>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: 'auto',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#374151' }}>
          <thead style={{ backgroundColor: '#f3f4f6', textTransform: 'uppercase', fontSize: '12px', color: '#6b7280' }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Specialisation</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={tdStyle}>{staff.name}</td>
                <td style={tdStyle}>{staff.specialisation}</td>
                <td style={tdStyle}>{staff.department}</td>
                <td style={tdStyle}>{staff.contact}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '9999px',
                      backgroundColor: staff.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: staff.status === 'Active' ? '#16a34a' : '#dc2626',
                      fontWeight: '500',
                    }}
                  >
                    {staff.status}
                  </span>
                </td>
                <td style={{ ...tdStyle, display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button style={{ color: '#3b82f6', cursor: 'pointer' }}>
                    <FaEdit />
                  </button>
                  <button style={{ color: '#ef4444', cursor: 'pointer' }}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No staff records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reusable inline styles
const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
};

const tdStyle = {
  padding: '12px 16px',
};

export default AllStaff;
