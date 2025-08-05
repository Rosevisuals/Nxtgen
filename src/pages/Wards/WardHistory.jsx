import React, { useState, useEffect } from 'react';

const demoHistory = [
  { id: 1, wardNumber: '101', patient: 'John Doe', from: '2024-07-10', to: '2024-07-15', status: 'Discharged' },
  { id: 2, wardNumber: '102', patient: 'Jane Smith', from: '2024-07-12', to: '2024-07-18', status: 'Discharged' },
  { id: 3, wardNumber: '103', patient: 'Mike Brown', from: '2024-07-14', to: '2024-07-20', status: 'Occupied' },
];

export default function WardHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setHistory(demoHistory), 500);
  }, []);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '900px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
        Ward History
      </h2>

      {history.length === 0 ? (
        <div style={{ color: '#64748b' }}>Loading...</div>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '16px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
              <th style={thStyle}>Ward Number</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>From</th>
              <th style={thStyle}>To</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{entry.wardNumber}</td>
                <td style={tdStyle}>{entry.patient}</td>
                <td style={tdStyle}>{entry.from}</td>
                <td style={tdStyle}>{entry.to}</td>
                <td style={{ ...tdStyle, color: entry.status === 'Occupied' ? '#dc2626' : '#16a34a' }}>
                  {entry.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Reusable styles
const thStyle = {
  padding: '12px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#334155',
  borderBottom: '2px solid #e2e8f0',
};

const tdStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#1e293b',
};

