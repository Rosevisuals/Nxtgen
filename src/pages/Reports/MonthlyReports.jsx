import React, { useState } from 'react';

const MonthlyReport = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div style={{
      padding: '24px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px'
      }}>Monthly Report</h1>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <label style={{ color: '#4b5563' }}>Select Month:</label>
        <input
          type="month"
          value={`${year}-${month}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split('-');
            setMonth(m);
            setYear(y);
          }}
          style={{
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563',
            marginBottom: '8px'
          }}>New Patients</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb'
          }}>120</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563',
            marginBottom: '8px'
          }}>Revenue</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#16a34a'
          }}>UGX 32M</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563',
            marginBottom: '8px'
          }}>Admissions</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#7c3aed'
          }}>42</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563',
            marginBottom: '8px'
          }}>Surgeries</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#dc2626'
          }}>11</p>
        </div>
      </div>

      {/* Placeholder for future chart */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '16px'
      }}>
        📊 Chart and detailed breakdown coming soon...
      </div>
    </div>
  );
};

export default MonthlyReport;